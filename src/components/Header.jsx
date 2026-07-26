function Header({name}){
    return(
        <header
        style = {{
            backgroundColor: "#4f46",
        color: "white",
        padding: "20px",
        textAlign: "center"
        }}>
            <h1>Welcome to {name}'s Portfolio</h1>
            <p style={{color:"black"}}>React Developer | Student | Learner</p>
        </header>
    );
}

export default Header;