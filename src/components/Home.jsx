import Header from "./Header";
import About from "./About";
import Skills from "./Skills";

function Home() {
  const skills = ["js", "react", "node.js", "python", "sql"];

  return (
    <div>
      <Header name="Ved" />
      <About />
      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
