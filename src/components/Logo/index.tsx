import { useIsMounted } from '../../hooks';
import { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';


const styles = {
  imgWidth: 350,
  imgHeight: 100,
  logo: 'w-[375px] print:w-[300px] h-auto cursor-pointer print:text-black print:mx-auto hide-on-print'
};

export type LogoProps = {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
};

const logo = '/images/seatac-dark.png';
const logoOnPrint = '/images/seatac.png';

export function Logo(props: Readonly<LogoProps>) {
  const isMounded: boolean = useIsMounted();
  const { className, width, height, src } = props;
  const [logoSrc, setLogoSrc] = useState<StaticImageData | string>(src ?? logo);

  useEffect(() => {
    const handleOnPrint = () => {
      setLogoSrc(logoOnPrint);
    };
    const handleAfterPrint = () => {
      setLogoSrc(logo);
    };
    if (isMounded) {
      window.addEventListener('beforeprint', handleOnPrint);
      window.addEventListener('afterprint', handleAfterPrint);
    }

    return () => {
      if (isMounded) {
        window.removeEventListener('beforeprint', handleOnPrint);
        window.removeEventListener('afterprint', handleAfterPrint);
      }
    };
  }, [isMounded]);
  return (
    <Image
      priority
      alt="SEA-TAC"
      src={logoSrc}
      width={width ?? styles.imgWidth}
      height={height ?? styles.imgHeight}
      className={className ?? styles.logo}
      onClick={() => (window.location.href = '/')}
    />
  );
}
