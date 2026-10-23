import { Filter } from "../../components";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../hooks";

export default function Home() {

    const navigate = useNavigate();
    const goToUser = (userId) => {
        navigate(`/user-profile/${userId}`)
    }
    const {draft, reset} = useFilter();

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h1>HOMEEE</h1>
            <Filter
                isIconDisplay={false}
                onChange={(e) => console.log("hello", e)}
                filter={draft}
                onReset={reset}
                // onSearch={() => {
                //     apply();
                //     setPage(1);
                // }}
            ></Filter>
            <button
                onClick={() => goToUser(6)}
            >Teste</button>
        </div>
    );
}