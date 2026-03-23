import {useParams, useLocation} from "react-router";
import {useEffect, useState} from "react";
import styles from "../styles/Detail.module.css";
import type {MovieItem} from "./Home.tsx";

type PrimaryImage = {
    url: string;
    width: number;
    height: number;
    type: string;
}

type Person = {
    id: string;
    displayName: string;
    primaryImage: PrimaryImage;
    primaryProfessions: string[];
    biography: string;
}

type MovieDetail = {
    id: string;
    type: string;
    isAdult: boolean;
    primaryTitle: string;
    originalTitle: string;
    primaryImage: PrimaryImage;
    startYear: number;
    endYear: number;
    runtimeSeconds: number;
    genres: string[];
    rating: {
        aggregateRating: number;
        voteCount: number;
    };
    metacritic: {
        url: string;
        score: number;
        reviewCount: number;
    };
    plot: string;
    directors: Person[];
    writers: Person[];
    stars: Person[];
    originCountries: { code: string; name: string }[];
    spokenLanguages: { code: string; name: string }[];
}

const BASE_URL = "https://api.imdbapi.dev";

const Detail = () => {
    const {id} = useParams();
    const location = useLocation();

    const movieItem = location.state?.movie as MovieItem | undefined;

    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${BASE_URL}/titles/${id}`)
            .then(response => {
                if (!response.ok) throw new Error("API Error");
                return response.json();
            })
            .then(data => {
                setMovie(data as MovieDetail);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch movie:", error);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    // 초 → 시간/분 변환
    const formatRuntime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <main className={styles.container}>
            {loading ? (
                <div className={styles.loading_container}>
                    <div className={styles.loader}></div>
                    <h1>Loading...</h1>
                </div>
            ) : error ? (
                // API 실패 시 Home에서 받은 movieItem으로 폴백
                <div className={styles.box}>
                    <div className={styles.poster_wrap}>
                        <img className={styles.poster} src={movieItem?.["#IMG_POSTER"]} alt={movieItem?.["#TITLE"]} />
                    </div>
                    <div className={styles.info}>
                        <h1 className={styles.title}>{movieItem?.["#TITLE"]}</h1>
                        <div className={styles.meta}>
                            <span className={styles.badge}>{movieItem?.["#YEAR"]}</span>
                            <span className={styles.badge}>Rank #{movieItem?.["#RANK"]}</span>
                        </div>
                        <p className={styles.actors}>출연: {movieItem?.["#ACTORS"]}</p>
                        <a href={movieItem?.["#IMDB_URL"]} target="_blank" rel="noreferrer" className={styles.imdb_link}>
                            IMDb에서 보기 →
                        </a>
                    </div>
                </div>
            ) : (
                <div className={styles.box}>
                    {/* 포스터 */}
                    <div className={styles.poster_wrap}>
                        <img className={styles.poster} src={movie?.primaryImage?.url} alt={movie?.primaryTitle} />
                    </div>

                    <div className={styles.info}>
                        {/* 제목 */}
                        <h1 className={styles.title}>{movie?.primaryTitle}</h1>
                        {movie?.originalTitle !== movie?.primaryTitle && (
                            <p className={styles.aka}>{movie?.originalTitle}</p>
                        )}

                        {/* 메타 정보 */}
                        <div className={styles.meta}>
                            <span className={styles.badge}>{movie?.startYear}</span>
                            {movie?.runtimeSeconds && (
                                <span className={styles.badge}>{formatRuntime(movie.runtimeSeconds)}</span>
                            )}
                            {movie?.type && (
                                <span className={styles.badge}>{movie.type}</span>
                            )}
                            <span className={styles.badge}>Rank #{movieItem?.["#RANK"]}</span>
                        </div>

                        {/* 평점 */}
                        {movie?.rating && (
                            <div className={styles.rating}>
                                <span className={styles.rating_score}>⭐ {movie.rating.aggregateRating.toFixed(1)}</span>
                                <span className={styles.vote_count}>({movie.rating.voteCount.toLocaleString()} votes)</span>
                            </div>
                        )}

                        {/* 줄거리 */}
                        <p className={styles.description}>{movie?.plot}</p>

                        {/* 장르 */}
                        <div className={styles.genreBox}>
                            {movie?.genres?.map((item, index) => (
                                <span key={index} className={styles.genre}>{item}</span>
                            ))}
                        </div>

                        {/* 감독 */}
                        {movie?.directors && movie.directors.length > 0 && (
                            <p className={styles.crew}>
                                감독: {movie.directors.map(d => d.displayName).join(", ")}
                            </p>
                        )}

                        {/* 출연 */}
                        {movie?.stars && movie.stars.length > 0 && (
                            <p className={styles.crew}>
                                출연: {movie.stars.map(s => s.displayName).join(", ")}
                            </p>
                        )}

                        {/* 국가 / 언어 */}
                        <div className={styles.meta}>
                            {movie?.originCountries?.map((c, i) => (
                                <span key={i} className={styles.badge}>{c.name}</span>
                            ))}
                            {movie?.spokenLanguages?.map((l, i) => (
                                <span key={i} className={styles.badge}>{l.name}</span>
                            ))}
                        </div>

                        {/* IMDb 링크 */}
                        <a href={movieItem?.["#IMDB_URL"]} target="_blank" rel="noreferrer" className={styles.imdb_link}>
                            IMDb에서 보기 →
                        </a>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Detail;