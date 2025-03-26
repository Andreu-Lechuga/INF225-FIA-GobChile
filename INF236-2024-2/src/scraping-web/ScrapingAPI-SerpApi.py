import serpapi
import os

'''
import logging
from .config.config import get_config

class GoogleScraper:
    """Class to handle Google scraping operations"""
    def __init__(self):
        self.config = get_config()
        self._setup_logging()
        self._initialize_client()
    
    def _setup_logging(self):
        """Configure logging based on environment settings"""
        logging.basicConfig(
            level=getattr(logging, self.config.LOG_LEVEL),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def _initialize_client(self):
        """Initialize SerpAPI client with configuration"""
        if not self.config.SERPAPI_KEY:
            raise ValueError("SERPAPI_KEY not found in environment configuration")
        
        self.client = serpapi.Client(
            api_key=self.config.SERPAPI_KEY,
            timeout=self.config.REQUEST_TIMEOUT
        )
        self.logger.info("SerpAPI client initialized successfully")
    
    async def search_agricultural_docs(self, query, max_results=10):
        """
        Search for agricultural documents
        
        Args:
            query (str): Search query
            max_results (int): Maximum number of results to return
        
        Returns:
            list: List of search results
        """
        try:
            self.logger.debug(f"Searching for: {query}")
            results = await self.client.search({
                'q': query,
                'num': max_results
            })
            self.logger.info(f"Found {len(results)} results for query: {query}")
            return results
        except Exception as e:
            self.logger.error(f"Error during search: {str(e)}")
            raise
'''

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
