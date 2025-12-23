import Spline from '@splinetool/react-spline';

interface SplineBackgroundProps {
  url: string;
}

export default function SplineBackground({ url }: SplineBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Spline scene={url} />
    </div>
  );
}

