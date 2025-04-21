import { useEffect } from "react";
import clsx from "clsx";
import { Popover, Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";

const reactions = [
  { emoji: "👍", label: "Like" },
  { emoji: "👎", label: "Dislike" },
  { emoji: "😆", label: "Haha" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
];

const ReactionPicker = ({
  classNameIcon = "text-base",
  selected = null,
  setSelected = () => {},
}) => {
  useEffect(() => {
    selected !== null && console.log(selected);
  }, [selected]);
  return (
    <Popover
      placement="topLeft"
      content={
        <div className="flex items-center justify-between w-full">
          {reactions.map((r) => (
            <button
              key={r.label}
              className={clsx(
                "text-xl transition-transform hover:scale-125 cursor-pointer",
                selected === r.emoji && "scale-110"
              )}
              title={r.label}
              onClick={() => setSelected(r.emoji)}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      }
    >
      <Button
        type="text"
        onClick={() => setSelected(selected ? null : "👍")}
        className={`p-2 transition-all bg-gray-100 border rounded-full hover:bg-gray-200 ${classNameIcon}`}
      >
        {selected ? selected : <LikeOutlined className={classNameIcon} />}
      </Button>
    </Popover>
  );
};

export default ReactionPicker;
