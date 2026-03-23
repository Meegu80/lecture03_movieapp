import styles from "./styles/Home.module.css"
import {useEffect, useState} from "react";

export type MovieItem = {
    "#TITLE": string;
    "#YEAR": number;
    "#IMDB_ID": string;
    "#RANK": number;
    "#ACTORS": string;
    "#AKA": string;
    "#IMDB_URL": string;
    "#IMDB_IV": string;
    "#IMG_POSTER": string;
    photo_width: number;
    photo_height: number;
}

const Home = () => {

    // loading 상태관리에 대한 함수
    const [ loading, setLoading ] = useState<boolean>(true);
    //
    const [ list, setList ] = useState<MovieItem[]>([]);

    useEffect(() => {
        fetch("https://imdb.iamidiotareyoutoo.com/search?q=2025&lsn=1&v=1")
            .then(response => response.json())
            .then(data => {
                setList(data.description as MovieItem[]);
                setLoading(false);
            })
    }, []);
// 렌더링 파트(JSX & TSX = 태그를 사용할 수 있게해주는 구간)===================================================================
    return (
        <div>
            {loading
                ? <h1>loading...</h1>
                : <div className={styles.container}>
                    {list.map((item, index) => {
                        return <Movie key={index}>{item}</Movie>
                    })}

                </div>




            }
        </div>
    )
}

export default Home;





















