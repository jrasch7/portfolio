import psycopg2
from psycopg2.extras import RealDictCursor
from flask import Flask, render_template

app = Flask(__name__)

def get_db_connection():
    # Conexão com o banco de dados oficial no PostgreSQL (WSL/Ubuntu)
    conn = psycopg2.connect(
        host="localhost",
        database="portfolio_db",
        user="postgres",
        password="123456" 
    )
    return conn

@app.route('/')
def index():
    try:
        conn = get_db_connection()
        # RealDictCursor é fundamental para tratar as colunas como chaves de dicionário
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # O TRIM remove espaços fantasmas do Postgres que costumam quebrar os IDs no HTML
        cur.execute('SELECT TRIM(nome) as nome, TRIM(categoria_pai) as categoria_pai FROM habilidades ORDER BY categoria_pai;')
        habilidades_brutas = cur.fetchall()
        
        cur.close()
        conn.close()

        # --- LÓGICA DE AGRUPAMENTO (Resolve o bug de duplicidade) ---
        habilidades_agrupadas = {}
        for item in habilidades_brutas:
            cat = item['categoria_pai']
            nome = item['nome']
            if cat not in habilidades_agrupadas:
                habilidades_agrupadas[cat] = []
            habilidades_agrupadas[cat].append(nome)

    except Exception as e:
        # Fallback de mock em caso de erro no banco (evita que a tela fique em branco no dev/testes)
        print(f"Aviso: Usando dados simulados pois houve erro de conexao: {e}")
        habilidades_agrupadas = {
            'Linguagens': ['Python', 'TypeScript', 'JavaScript', 'PHP'],
            'Banco de Dados': ['PostgreSQL', 'MySQL', 'SQLite'],
            'Front-end': ['HTML5', 'CSS3', 'Tailwind CSS', 'React'],
            'Back-end': ['Flask', 'Node.js', 'Express']
        }

    return render_template('index.html', habilidades=habilidades_agrupadas)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
