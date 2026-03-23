import {BrowserRouter, Route, Routes} from "react-router";

const App = () => {

// 렌더링 파트(JSX & TSX = 태그를 사용할 수 있게해주는 구간)=================================================================== 
    return (
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/movie/:id"} element={<Detail />} />
          </Routes>
        </BrowserRouter>
    )
}

export default App;
















