import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-light mb-4">About Us</h1>
        <div className="bg-dark-accent rounded-lg p-6 text-light">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg">
            Pitchington aims to solve the many headaches and pains of presentations and meetings in the corporate world. Created by a team of 4 students for uOttawa hack 7, GrampSoft ensures that Pitchington can help as many speakers get their point across as possible.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;