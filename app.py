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
        # Transformamos a lista "reta" do banco em um dicionário organizado
        habilidades_agrupadas = {}
        
        for item in habilidades_brutas:
            cat = item['categoria_pai']
            nome = item['nome']
            
            # Se a categoria (ex: 'Banco de Dados') ainda não está no dicionário, criamos a lista
            if cat not in habilidades_agrupadas:
                habilidades_agrupadas[cat] = []
            
            # Adicionamos o nome (ex: 'PostgreSQL') dentro daquela categoria
            habilidades_agrupadas[cat].append(nome)
        
        # Agora enviamos o dicionário organizado: {'Banco de Dados': ['PostgreSQL', 'SQLite'], ...}
        return render_template('index.html', habilidades=habilidades_agrupadas)
        
    except Exception as e:
        # Caso o banco esteja desligado ou a senha esteja errada, ele avisa aqui
        return f"Erro de Conexão ou Banco de Dados: {e}"

if __name__ == '__main__':
    # Roda em modo debug para você ver as alterações em tempo real no terminal
    app.run(debug=True, host='0.0.0.0', port=5000)