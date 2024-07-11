import Image from 'next/image';
import logo from '../../assets/images/seatac-dark.png';

const styles = {
  imgWidth: 350,
  imgHeight: 100,
  logo: 'w-[375px] h-auto',
  header: 'w-full h-auto flex flex-col gap-16',
  body: 'bg-slate-950 text-gray-200 flex min-h-full flex-col items-center justify-start p-5'
};

export type LogoProps = {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function Logo(props: LogoProps) {
  const {className, width, height, src} = props;
  return (
    <Image
      priority
      id="logo"
      alt="SEA-TAC"
      src={src ?? logo}
      width={width ?? styles.imgWidth}
      height={height ?? styles.imgHeight}
      className={className ?? styles.logo}
    />
  );
}
