import { useEffect } from "react";
import { LikeOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { clsx } from "clsx";

const ReactionPicker = ({
  classNameIcon = "text-base",
  selected = null,
  onEmojiClick,
  onButtonClick,
}) => {
  const reactions = [
    { emoji: "👍", label: "LIKE" },
    { emoji: "👎", label: "DISLIKE" },
    { emoji: "😆", label: "HAHA" },
    { emoji: "❤️", label: "LOVE" },
    { emoji: "😮", label: "WOW" },
    { emoji: "😢", label: "SAD" },
  ];

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
              onClick={(e) => onEmojiClick(r.emoji, e)}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      }
    >
      <Button
        type="text"
        onClick={(e) => onButtonClick(e)}
        className={`p-2 transition-all bg-gray-100 border rounded-full hover:bg-gray-200 ${classNameIcon}`}
      >
        {selected ? selected : <LikeOutlined className={classNameIcon} />}
      </Button>
    </Popover>
  );
};

export default ReactionPicker;
