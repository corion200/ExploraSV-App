import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from functools import wraps
import logging
from datetime import datetime
import random

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuración CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
CORS(app, resources={r"/*": {"origins": [o.strip() for o in ALLOWED_ORIGINS.split(",")]}})

# Configuración de base de datos ExploraSV
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'explorasv'),
    'charset': 'utf8mb4',
    'autocommit': True
}

API_TOKEN = os.getenv("API_TOKEN")

def get_db_connection():
    """Crear conexión a la base de datos ExploraSV"""
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        return None

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not API_TOKEN:
            return f(*args, **kwargs)
        
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({"error": "Token requerido"}), 401
            
        token = auth.replace('Bearer ', '')
        if token != API_TOKEN:
            return jsonify({"error": "Token inválido"}), 401
            
        return f(*args, **kwargs)
    return wrapper

# Ruta principal HTML (mantenida de tu código original)
@app.route('/')
def index():
    return send_from_directory('.', 'chatAriss.html')

@app.route('/health', methods=['GET'])
def health():
    """Verificar estado del servicio"""
    db = get_db_connection()
    db_status = "ok" if db else "error"
    if db:
        db.close()
    
    return jsonify({
        "status": "ok",
        "database": db_status,
        "mascot": "Tori el Torogoz",
        "platform": "ExploraSV",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

# Endpoint principal del chatbot - Tori el Torogoz
@app.route('/chatbot', methods=['POST'])
@require_auth
def chatbot_response():
    """Tori el Torogoz responde a los turistas"""
    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get('message') or '').strip()
        
        if not user_message:
            return jsonify({"error": "¡Pío pío! Necesito que me escribas algo para poder ayudarte."}), 400
        
        logger.info(f"Tori recibe mensaje: {user_message}")
        
        # Generar respuesta como Tori
        response_message = generate_Tori_response(user_message)
        
        # Guardar conversación
        save_conversation(user_message, response_message)
        
        return jsonify({"response": response_message})
        
    except Exception as e:
        logger.error(f"Error en Tori: {e}")
        return jsonify({"response": "¡Pío pío! Algo salió mal. Inténtalo de nuevo en un momento."})

def generate_Tori_response(message):
    """Tori el Torogoz genera respuestas personalizadas para turistas"""
    txt = message.lower()
    
    # Saludos - Tori se presenta
    if any(word in txt for word in ['hola', 'hey', 'buenos días', 'buenas tardes', 'buenas noches', 'hi']):
        greetings = [
            "¡Pío pío! 🐦 ¡Hola! Soy Tori, tu torogoz guía de ExploraSV. Estoy aquí para ayudarte a descubrir lo mejor de El Salvador.",
            "¡Qué alegría verte! 🌟 Soy Tori, el torogoz más viajero de El Salvador. ¿Listo para explorar nuestro hermoso país?",
            "¡Pío pío! ¡Bienvenido a ExploraSV! 🇸🇻 Soy Tori y conozco todos los rincones mágicos de nuestra tierra. ¿En qué puedo ayudarte?"
        ]
        return random.choice(greetings)
    
    # Despedidas
    elif any(word in txt for word in ['adiós', 'bye', 'hasta luego', 'nos vemos', 'chao']):
        farewells = [
            "¡Pío pío! ¡Hasta pronto! Que disfrutes mucho explorando El Salvador. 🌺",
            "¡Que tengas un vuelo increíble! 🐦 Recuerda que siempre estaré aquí cuando necesites consejos de viaje.",
            "¡Nos vemos pronto! Espero haberte ayudado a planear una aventura inolvidable en nuestro bello El Salvador. 🌋"
        ]
        return random.choice(farewells)
    
    # Agradecimientos
    elif any(word in txt for word in ['gracias', 'thanks', 'muchas gracias']):
        thanks = [
            "¡Pío pío! ¡De nada! Es mi placer ayudar a los visitantes de nuestra bella tierra. 💙",
            "¡Para eso estoy! Como buen torogoz, me encanta compartir lo mejor de El Salvador. 🌟",
            "¡Es un gusto ayudarte! ¿Hay algo más que quieras saber sobre nuestros destinos?"
        ]
        return random.choice(thanks)
    
    # Información sobre hoteles
    elif any(word in txt for word in ['hotel', 'hospedaje', 'donde quedarme', 'alojamiento']):
        return get_hotels_info()
    
    # Información sobre restaurantes
    elif any(word in txt for word in ['restaurante', 'comida', 'comer', 'pupusa', 'donde comer']):
        return get_restaurants_info()
    
    # Información sobre sitios turísticos
    elif any(word in txt for word in ['sitio', 'lugar', 'turistico', 'visitar', 'conocer', 'atraccion']):
        return get_tourist_sites_info()
    
    # Zonas específicas
    elif any(word in txt for word in ['occidental', 'santa ana', 'ahuachapan', 'sonsonate']):
        return "¡Pío pío! La Zona Occidental es preciosa. Ahí encuentras la Ruta de las Flores, el Lago de Coatepeque y volcanes increíbles. ¿Te interesa algún lugar específico?"
    
    elif any(word in txt for word in ['central', 'san salvador', 'la libertad', 'chalatenango']):
        return "¡La Zona Central es el corazón del país! 💖 Tienes San Salvador, las playas de La Libertad, y sitios arqueológicos como Joya de Cerén. ¿Qué te gustaría explorar?"
    
    elif any(word in txt for word in ['oriental', 'san miguel', 'la union', 'usulutan']):
        return "¡Pío pío! La Zona Oriental tiene playas espectaculares y el Golfo de Fonseca. ¡Es perfecta para los amantes del mar! 🌊"
    
    # Reservas
    elif any(word in txt for word in ['reserva', 'reservar', 'booking']):
        return "¡Perfecto! En ExploraSV puedes hacer reservas fácilmente. Te ayudo a encontrar el lugar ideal y luego puedes reservar directamente desde la app. ¿Qué tipo de lugar buscas?"
    
    # Actividades específicas
    elif any(word in txt for word in ['playa', 'mar', 'surf']):
        return "¡Las playas salvadoreñas son increíbles! 🏄‍♂️ Desde La Libertad hasta La Unión, tenemos olas perfectas y paisajes de ensueño. ¿Prefieres playas para surf o para relajarte?"
    
    elif any(word in txt for word in ['volcan', 'montana', 'senderismo', 'hiking']):
        return "¡Los volcanes de El Salvador son espectaculares! 🌋 Puedes visitar el Volcán de Izalco, Santa Ana o hacer senderismo en Cerro Verde. ¿Eres aventurero?"
    
    elif any(word in txt for word in ['lago', 'coatepeque', 'ilopango']):
        return "¡Los lagos son joyas naturales! 💎 El Lago de Coatepeque es perfecto para relajarse, hacer kayak o disfrutar de la gastronomía local. ¿Te gusta el agua?"
    
    # Comida típica
    elif any(word in txt for word in ['pupusa', 'comida tipica', 'gastronomia']):
        return "¡Pío pío! ¡Las pupusas son deliciosas! 🫓 También tienes que probar el atol shuco, tamales, yuca frita y casamiento. ¿Te ayudo a encontrar los mejores lugares?"
    
    # Información sobre El Salvador
    elif any(word in txt for word in ['el salvador', 'pais', 'cultura', 'historia']):
        return "¡El Salvador es pequeño pero lleno de maravillas! 🇸🇻 Somos el país de los volcanes y el único sin costa al Atlántico. Tenemos una cultura rica, gente cálida y paisajes increíbles. ¡Como yo, el torogoz, que soy nuestra ave nacional! 🐦"
    
    # Clima
    elif any(word in txt for word in ['clima', 'tiempo', 'lluvia', 'calor']):
        return "¡El clima aquí es tropical! ☀️ Tenemos época seca (noviembre-abril) y lluviosa (mayo-octubre). La temperatura promedio es de 25°C. ¡Perfecto para volar como yo! ¿En qué época planeas visitarnos?"
    
    # Ayuda general
    elif any(word in txt for word in ['ayuda', 'help', 'no se', 'perdido']):
        return """¡Pío pío! Estoy aquí para ayudarte con:
🏨 Hoteles y hospedajes
🍽️ Restaurantes y comida típica  
🏞️ Sitios turísticos y actividades
🗺️ Información sobre las zonas del país
📅 Consejos para tu viaje
🎯 Reservas y recomendaciones

¡Solo pregúntame lo que necesites saber! 🐦"""
    
    # Respuesta por defecto de Tori
    else:
        default_responses = [
            "¡Pío pío! Esa es una pregunta interesante. Como torogoz, conozco muchos lugares increíbles en El Salvador. ¿Te puedo ayudar con información sobre hoteles, restaurantes o sitios turísticos?",
            "¡Qué curioso! 🤔 No tengo una respuesta específica para eso, pero puedo ayudarte con todo lo relacionado al turismo en El Salvador. ¿Qué te gustaría explorar?",
            "¡Pío pío! Me encanta tu curiosidad. Aunque no tenga esa información específica, puedo guiarte para que tengas la mejor experiencia en nuestro hermoso país. ¿En qué más puedo ayudarte?"
        ]
        return random.choice(default_responses)

def get_hotels_info():
    """Obtener información de hoteles desde la base de datos"""
    try:
        db = get_db_connection()
        if not db:
            return "¡Pío pío! No puedo acceder a la información de hoteles ahora. Inténtalo en un momento."
        
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT h.Nom_Hotel, h.Descrip_Hotel, z.Nom_Zon 
        FROM hoteles h 
        JOIN zonas z ON h.Id_Zon6 = z.Id_Zon 
        LIMIT 3
        """
        cursor.execute(query)
        hoteles = cursor.fetchall()
        cursor.close()
        db.close()
        
        if hoteles:
            response = "¡Pío pío! Te recomiendo estos hoteles increíbles:\n\n"
            for hotel in hoteles:
                response += f"🏨 {hotel['Nom_Hotel']} ({hotel['Nom_Zon']})\n"
                response += f"   {hotel['Descrip_Hotel']}\n\n"
            response += "¿Te interesa alguno en particular? ¡Puedo ayudarte con más detalles!"
            return response
        else:
            return "¡Pío pío! No encontré hoteles en este momento, pero te puedo ayudar a buscar hospedajes en cualquier zona del país. ¿Dónde te gustaría quedarte?"
            
    except Exception as e:
        logger.error(f"Error obteniendo hoteles: {e}")
        return "¡Ups! Tuve un pequeño problema buscando hoteles. ¿Puedes intentar de nuevo?"

def get_restaurants_info():
    """Obtener información de restaurantes"""
    try:
        db = get_db_connection()
        if not db:
            return "¡Pío pío! No puedo acceder a la info de restaurantes ahora. ¡Dame un momento!"
        
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT r.Nom_Rest, r.Descrip_Rest, z.Nom_Zon 
        FROM restaurantes r 
        JOIN zonas z ON r.Id_Zon5 = z.Id_Zon 
        LIMIT 3
        """
        cursor.execute(query)
        restaurantes = cursor.fetchall()
        cursor.close()
        db.close()
        
        if restaurantes:
            response = "¡Pío pío! Aquí tienes lugares deliciosos para comer:\n\n"
            for rest in restaurantes:
                response += f"🍽️ {rest['Nom_Rest']} ({rest['Nom_Zon']})\n"
                response += f"   {rest['Descrip_Rest']}\n\n"
            response += "¡La comida salvadoreña es espectacular! ¿Cuál te llama la atención?"
            return response
        else:
            return "¡Pío pío! ¡La gastronomía salvadoreña es increíble! Te puedo recomendar pupuserías, comedores típicos y restaurantes gourmet. ¿Qué tipo de comida prefieres?"
            
    except Exception as e:
        logger.error(f"Error obteniendo restaurantes: {e}")
        return "¡Ups! Problema buscando restaurantes. ¡Como buen torogoz, seguiré buscando! Inténtalo otra vez."

def get_tourist_sites_info():
    """Obtener información de sitios turísticos"""
    try:
        db = get_db_connection()
        if not db:
            return "¡Pío pío! Los sitios turísticos están temporalmente fuera de mi alcance. ¡Inténtalo pronto!"
        
        cursor = db.cursor(dictionary=True)
        query = """
        SELECT s.Nom_Siti, s.Descrip_Siti, s.Activi_Siti, z.Nom_Zon 
        FROM sitios_turisticos s 
        JOIN zonas z ON s.Id_Zon4 = z.Id_Zon 
        LIMIT 3
        """
        cursor.execute(query)
        sitios = cursor.fetchall()
        cursor.close()
        db.close()
        
        if sitios:
            response = "¡Pío pío! Estos lugares te van a encantar:\n\n"
            for sitio in sitios:
                response += f"🏞️ {sitio['Nom_Siti']} ({sitio['Nom_Zon']})\n"
                response += f"   {sitio['Descrip_Siti']}\n"
                if sitio['Activi_Siti']:
                    response += f"   Actividades: {sitio['Activi_Siti']}\n\n"
            response += "¡El Salvador tiene tantos tesoros por descubrir! ¿Te interesa alguno?"
            return response
        else:
            return "¡Pío pío! El Salvador está lleno de lugares mágicos: cascadas, volcanes, lagos, playas, sitios arqueológicos. ¿Qué tipo de aventura buscas?"
            
    except Exception as e:
        logger.error(f"Error obteniendo sitios turísticos: {e}")
        return "¡Problemita técnico! Como torogoz explorador, conozco muchos lugares. ¡Inténtalo de nuevo!"

def save_conversation(user_message, bot_response):
    """Guardar conversación de Tori en la base de datos"""
    try:
        db = get_db_connection()
        if not db:
            return
            
        cursor = db.cursor()
        
        # Usar tabla chatbot existente o crear una nueva para Tori
        query = """
        INSERT INTO chatbot (Mesj, Resp) 
        VALUES (%s, %s)
        """
        cursor.execute(query, (user_message, bot_response))
        
        cursor.close()
        db.close()
        
    except Exception as e:
        logger.error(f"Error guardando conversación de Tori: {e}")

# Mantener endpoints originales de consultas para compatibilidad
@app.route('/consultas', methods=['GET'])
@require_auth
def get_consultas():
    try:
        db = get_db_connection()
        if not db:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500
            
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM chatbot ORDER BY Id_Consulta DESC")
        consultas = cursor.fetchall()
        cursor.close()
        db.close()
        
        return jsonify(consultas)
        
    except Exception as e:
        logger.error(f"Error obteniendo consultas: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    logger.info(f"🐦 Iniciando Tori el Torogoz - ExploraSV Chatbot")
    logger.info(f"Puerto: {port} | Base de datos: {DB_CONFIG['database']}")
    
    app.run(host="0.0.0.0", port=port, debug=debug)
