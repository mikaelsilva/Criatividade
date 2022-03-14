#codigo usado para baixar as artes dos artistas
from bing_image_downloader import downloader

downloader.download('kobra street art', limit=20, output_dir=f'./', adult_filter_off=True, force_replace=False, timeout=60, verbose=True)
