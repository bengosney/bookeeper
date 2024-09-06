import { useSpring, animated } from "react-spring";

interface NumberProps {
  value: number;
  delay?: number;
}

export const Number = ({ value, delay = 100 }: NumberProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: delay,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.span>{number.to((x) => x.toFixed(0))}</animated.span>;
};
