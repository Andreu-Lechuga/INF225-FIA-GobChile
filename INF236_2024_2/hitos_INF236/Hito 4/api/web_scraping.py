import serpapi
import os

from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('SERPAPI_KEY')
client = serpapi.Client(api_key=api_key)

result = client.search(
    q="café",  # Consulta en español
    engine="google",
    location="Santiago, Chile",  # Cambiado a Santiago, Chile
    hl="es",  # Idioma en español
    gl="cl"   # Región configurada para Chile
)

# Si deseas imprimir los resultados (por ejemplo, títulos y enlaces):
for item in result.get("organic_results", []):
    print("Título:", item["title"])
    print("Enlace:", item["link"])
    print("Descripción:", item.get("snippet", ""))
    print("-------------------")
