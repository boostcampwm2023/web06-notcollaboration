interface GameDefaultBoxProps {
  children: React.ReactNode;
  className?: String;
}

const GameDefaultBox: React.FC<GameDefaultBoxProps> = ({ children, className = "" }) => {
  return (
    <div className={"flex p-3 h-full w-full rounded-3xl border-8 border-white bg-skyblue " + className}>
      <div className="p-2 h-full w-full rounded-xl bg-lightskyblue">{children}</div>
    </div>
  );
};

export default GameDefaultBox;
