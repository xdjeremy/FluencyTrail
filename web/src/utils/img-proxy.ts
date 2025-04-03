const imgProxyUrl = process.env.IMG_PROXY_URL || 'https://wsrv.nl/';

type ImgProxyFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

interface ImgProxyProps {
  url: string;
  width?: number;
  height?: number;
  fit?: ImgProxyFit;
}

const defaultImgProxy: ImgProxyProps = {
  url: '',
  width: 900,
  height: 600,
  fit: 'cover' as 'cover' | 'contain' | 'fill' | 'inside' | 'outside',
};

const imgProxy = ({
  url,
  width = defaultImgProxy.width,
  height = defaultImgProxy.height,
  fit = defaultImgProxy.fit,
}: ImgProxyProps) => {
  return `${imgProxyUrl}?url=${encodeURIComponent(url)}&w=${width}&h=${height}&fit=${fit}`;
};

export { imgProxy };
