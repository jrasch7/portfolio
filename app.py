import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask import Flask, render_template

app = Flask(__name__)

def get_db_connection():
    # Conexão com o banco de dados via variáveis de ambiente para segurança (Security Best Practice)
    try:
        conn = psycopg2.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            database=os.environ.get("DB_NAME", "portfolio_db"),
            user=os.environ.get("DB_USER", "postgres"),
            password=os.environ.get("DB_PASSWORD", "")
        )
        return conn
    except Exception:
        return None

@app.route('/')
def index():
    # Sec Headers implementation para pentest / segurança
    habilidades_agrupadas = {}

    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('SELECT TRIM(nome) as nome, TRIM(categoria_pai) as categoria_pai FROM habilidades ORDER BY categoria_pai;')
            habilidades_brutas = cur.fetchall()
            cur.close()
            conn.close()

            for item in habilidades_brutas:
                cat = item['categoria_pai']
                nome = item['nome']
                if cat not in habilidades_agrupadas:
                    habilidades_agrupadas[cat] = []
                habilidades_agrupadas[cat].append(nome)
        except Exception:
            conn = None

    if not conn:
        habilidades_agrupadas = {
            'Linguagens': ['Python', 'TypeScript', 'JavaScript', 'PHP'],
            'Banco de Dados': ['PostgreSQL', 'MySQL', 'SQLite'],
            'Front-end': ['HTML5', 'CSS3', 'Tailwind CSS', 'React'],
            'Back-end': ['Flask', 'Node.js', 'Express']
        }

    response = app.make_response(render_template('index.html', habilidades=habilidades_agrupadas))
    # Security Headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

if __name__ == '__main__':
    # Produção deve usar gunicorn ou similar. Evitando debug=True em produção.
    is_prod = os.environ.get('FLASK_ENV') == 'production'
    # Bind_all (0.0.0.0) mantido apenas para desenvolvimento, use WSGI proxy reverso em prod
    host_bind = '127.0.0.1' if is_prod else '0.0.0.0' # nosec B104
    app.run(debug=not is_prod, host=host_bind, port=5000)
