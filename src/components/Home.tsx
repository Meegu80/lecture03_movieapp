import {useEffect, useState, useRef} from "react";
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

// 스크롤할 때마다 다른 쿼리로 새 데이터 요청
const QUERIES = ["2025", "2024", "2023", "2022", "2021", "2020", "action", "comedy", "thriller", "horror", "drama", "sci-fi"];

const Home = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [list, setList] = useState<MovieItem[]>([]);
    const [queryIndex, setQueryIndex] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    // 맨 아래 감지할 div에 붙일 ref
    const bottomRef = useRef<HTMLDivElement>(null);

    // 쿼리 인덱스가 바뀔 때마다 새 데이터 fetch
    useEffect(() => {
        const query = QUERIES[queryIndex % QUERIES.length];

        setIsFetching(true);
        fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${query}&lsn=1&v=1`)
            .then(response => response.json())
            .then(data => {
                if (data.description) {
                    // 기존 리스트에 새 데이터 추가 (중복 제거)
                    setList(prev => {
                        const existingIds = new Set(prev.map(m => m["#IMDB_ID"]));
                        const newItems = (data.description as MovieItem[]).filter(
                            m => !existingIds.has(m["#IMDB_ID"])
                        );
                        return [...prev, ...newItems];
                    });
                }
                setLoading(false);
                setIsFetching(false);
            })
            .catch((error) => {
                console.error("Failed to fetch movies:", error);
                setLoading(false);
                setIsFetching(false);
            });
    }, [queryIndex]);

    // IntersectionObserver로 맨 아래 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // bottomRef가 화면에 보이면 다음 쿼리로 이동
                if (entries[0].isIntersecting && !isFetching) {
                    setQueryIndex(prev => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => observer.disconnect();
    }, [isFetching]);

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

                    {/* 이 div가 화면에 보이면 자동으로 다음 데이터 로드 */}
                    <div ref={bottomRef} className={styles.bottom_trigger}>
                        {isFetching && (
                            <div className={styles.loading_container}>
                                <div className={styles.loader}></div>
                                <p>Loading more...</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}

export default Home;