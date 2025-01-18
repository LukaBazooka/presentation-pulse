import Layout from "@/components/Layout";
import { UserRound, UserRoundCheck, UsersRound, User } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-light mb-4">About Us</h1>
        <div className="bg-dark-accent rounded-lg p-6 text-light">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg mb-8">
            Pitchington aims to solve the many headaches and pains of presentations and meetings in the corporate world. Created by a team of 4 students for uOttawa hack 7, GrampSoft ensures that Pitchington can help as many speakers get their point across as possible.
          </p>
          
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <UserRound className="w-16 h-16 text-light" />
              <span className="mt-2 text-light">John Smith</span>
            </div>
            <div className="flex flex-col items-center">
              <UserRoundCheck className="w-16 h-16 text-light" />
              <span className="mt-2 text-light">Emma Johnson</span>
            </div>
            <div className="flex flex-col items-center">
              <UsersRound className="w-16 h-16 text-light" />
              <span className="mt-2 text-light">Michael Brown</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-16 h-16 text-light" />
              <span className="mt-2 text-light">Sarah Davis</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;