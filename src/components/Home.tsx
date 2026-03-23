import {useEffect, useState} from "react";
import Movie from "./Movie.tsx";
import styles from "../styles/Home.module.css";

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
                // API 응답 구조가 올바른지 확인 후 상태 업데이트
                if (data.description) {
                    setList(data.description as MovieItem[]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch movies:", error);
                setLoading(false);
            });
    }, []);
// 렌더링 파트(JSX & TSX = 태그를 사용할 수 있게해주는 구간)===================================================================
    return (
        <main className={styles.main}>
            {loading ? (
                <div className={styles.loading_container}>
                    <div className={styles.loader}></div>
                    <h1>Loading Cinematic Experience...</h1>
                </div>
            ) : (
                <>
                    <header className={styles.header}>
                        <div className={styles.header_content}>
                            <h1 className={styles.title}>Explore <span className={styles.highlight}>Movies</span></h1>
                            <p className={styles.subtitle}>Discover the latest and greatest in cinema for 2025</p>
                        </div>
                    </header>
                    <div className={styles.container}>
                        {list.map((item) => (
                            <Movie key={item["#IMDB_ID"]} movie={item} />
                        ))}
                    </div>
                </>
            )}
        </main>
    )
}

export default Home;
