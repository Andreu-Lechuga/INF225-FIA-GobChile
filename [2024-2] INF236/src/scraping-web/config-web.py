import os
from pathlib import Path

class Config:
    """Base configuration class"""
    def __init__(self):
        # Obtiene la ruta base del proyecto (2 niveles arriba de este archivo)
        self.BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
        self.SERPAPI_KEY = None
        self.LOG_LEVEL = 'INFO'
        self.CACHE_ENABLED = True
        self.REQUEST_TIMEOUT = 30

class DevelopmentConfig(Config):
    """Development configuration"""
    def __init__(self):
        super().__init__()
        self.ENV_FILE = self.BASE_DIR / 'config' / 'development.env'
        self._load_config()

class ProductionConfig(Config):
    """Production configuration"""
    def __init__(self):
        super().__init__()
        self.ENV_FILE = self.BASE_DIR / 'config' / 'production.env'
        self._load_config()

class TestConfig(Config):
    """Test configuration"""
    def __init__(self):
        super().__init__()
        self.ENV_FILE = self.BASE_DIR / 'config' / 'test.env'
        self._load_config()
        
    def _load_config(self):
        """Load configuration from .env file"""
        from dotenv import load_dotenv
        if not self.ENV_FILE.exists():
            raise FileNotFoundError(f"Configuration file not found: {self.ENV_FILE}")
        
        load_dotenv(self.ENV_FILE)
        self.SERPAPI_KEY = os.getenv('SERPAPI_KEY')
        self.LOG_LEVEL = os.getenv('LOG_LEVEL', self.LOG_LEVEL)
        self.CACHE_ENABLED = os.getenv('CACHE_ENABLED', self.CACHE_ENABLED)
        self.REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', self.REQUEST_TIMEOUT))

def get_config():
    """Factory function to get the appropriate config based on environment"""
    env = os.getenv('ENVIRONMENT', 'development').lower()
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'test': TestConfig
    }
    
    config_class = config_map.get(env)
    if not config_class:
        raise ValueError(f"Invalid environment: {env}")
    
    return config_class()
