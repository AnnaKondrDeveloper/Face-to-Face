import style from "./Post.module.css";
import MyPost from "./MyPost/MyPost";

const Post = (props) => {
	debugger

	let state = props.store;

	let postsElements = 
	state.postsMessage.map(p => <MyPost message={p.text} id={p.id} likesCount={p.likesCount}/>);

  return (
    <div className={style.post}>
      <div className={style.item}>
			{postsElements}
      </div>
    </div>
  );
};

export default Post;
