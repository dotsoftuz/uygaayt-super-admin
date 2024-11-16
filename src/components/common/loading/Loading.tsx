import { LoaderStyled } from "./Loader.style";
const Loading = () => {
  return (
    <LoaderStyled>
      <div className="scale">
        <span className="loader"></span>
      </div>
    </LoaderStyled>
  );
};

export default Loading;
