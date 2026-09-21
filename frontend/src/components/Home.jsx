import Header from "./Header";
import About from "./About";
import Skills from "./Skills";

function Home() {
  const skills = ["JavaScript", "React", "Node.js", "Python", "SQL"];

  return (
    <div>
      <Header name="Ved" />
      <div className="grid-2">
        <About />
        <Skills skillList={skills} />
      </div>
    </div>
  );
}

export default Home;
