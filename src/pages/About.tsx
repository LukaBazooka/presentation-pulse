import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Our Team</h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          Pitchington aims to solve the many headaches and pains of presentations and meetings in the corporate world. Created by a team of 4 students for uOttawa hack 7, GrampSoft ensures that Pitchington can help as many speakers get their point across as possible.
        </p>
      </div>
    </Layout>
  );
};

export default About;