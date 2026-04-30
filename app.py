# Versao sem dependencias de banco de dados
import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Estrutura estática de habilidades, dispensando a necessidade de banco de dados
    # para uma página de portfólio (apresentação), economizando recursos e evitando quedas.
    habilidades_agrupadas = {
        'Linguagens': ['Python', 'TypeScript', 'JavaScript', 'PHP'],
        'Banco de Dados': ['PostgreSQL', 'MySQL', 'SQLite'],
        'Front-end': ['HTML5', 'CSS3', 'Tailwind CSS', 'React'],
        'Back-end': ['Flask', 'Node.js', 'Express'],
        'Infraestrutura': ['Linux', 'Docker', 'AWS'],
        'Ferramentas': ['Git', 'GitHub', 'VS Code', 'Figma']
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
