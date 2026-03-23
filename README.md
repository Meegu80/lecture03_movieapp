# Lecture03 MovieApp

React와 TypeScript를 사용하여 개발된 영화 탐색 애플리케이션입니다.

## 🛠️ 기술 스택

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Routing**: React Router
- **HTTP Client**: Native Fetch API

## 📋 주요 기능

### 1. 영화 목록 조회 (Infinite Scroll)
- 초기 로딩 시 2025년 영화 데이터를 Fetch합니다.
- 스크롤이 하단에 도달하면 `IntersectionObserver`를 사용하여 자동으로 추가 데이터를 로드합니다.
- 중복된 영화 데이터는 `Set`을 사용하여 필터링합니다.

### 2. 영화 상세 정보
- 영화 카드를 클릭하면 상세 페이지로 이동합니다.
- `React Router`를 사용하여 SPA(Single Page Application) 형태로 구현되었습니다.
- 상세 정보 API 호출 실패 시, 목록에서 전달받은 기본 정보를 폴백(Fallback)으로 보여줍니다.

### 3. 로딩 상태 관리
- 데이터 Fetch 중에는 커스텀 스피너 컴포넌트를 보여줍니다.
- 추가 데이터 로딩 시 하단에 로딩 인디케이터를 표시합니다.

---

## 💻 핵심 코드 정리

### 무한 스크롤 (Intersection Observer)
`Home.tsx`에서 구현된 무한 스크롤 로직입니다. `IntersectionObserver`를 사용하여 사용자가 리스트의 끝에 도달했는지 감지하고, 다음 데이터를 불러옵니다.

```typescript
// IntersectionObserver로 맨 아래 감지 (ref로 최신 isFetching 상태 참조)
const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isFetchingRef.current) {
        setQueryIndex(prev => prev + 1);
    }
}, []);

useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0 });

    if (bottomRef.current) {
        observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
}, [handleIntersect]);
```

### 데이터 중복 제거 로직
API에서 받아온 데이터 중 이미 리스트에 존재하는 영화를 걸러내는 로직입니다. `Set`을 사용하여 O(1) 조회 속도로 중복을 효율적으로 제거합니다.

```typescript
setList(prev => {
    const existingIds = new Set(prev.map(m => m["#IMDB_ID"]));
    const newItems = (data.description as MovieItem[]).filter(
        m => !existingIds.has(m["#IMDB_ID"])
    );
    return [...prev, ...newItems];
});
```

### 상세 페이지 데이터 폴백 처리
`Detail.tsx`에서 상세 정보를 불러오는 API 호출이 실패할 경우, `react-router`의 `state`로 전달받은 기본 영화 정보를 대신 보여줍니다.

```typescript
// API 실패 시 Home에서 받은 movieItem으로 폴백
if (error) {
    return (
        <div className={styles.box}>
            <div className={styles.poster_wrap}>
                <img className={styles.poster} src={movieItem?.["#IMG_POSTER"]} alt={movieItem?.["#TITLE"]} />
            </div>
            <div className={styles.info}>
                <h1 className={styles.title}>{movieItem?.["#TITLE"]}</h1>
                {/* ...기타 기본 정보 표시... */}
            </div>
        </div>
    );
}
```
