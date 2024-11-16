import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import '../styles/_variables.scss'
export const Like = (props) => {
    const { liked, handleClick } = props;
    const styleIcon = { fontSize: 20, paddingRight: "2rem" };
    return (

        <div>
            <div onClick={handleClick} style={{ marginBottom: "-3rem" }}>
                {liked ? <HeartFilled style={{ ...styleIcon, color: "#1677ff" }} />
                    : <HeartOutlined style={styleIcon} />}
            </div>
        </div>
    )
}