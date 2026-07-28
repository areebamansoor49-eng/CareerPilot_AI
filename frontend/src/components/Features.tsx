function Features() {
  return (
    <section className="mt-32 px-10">
      <h2 className="text-4xl font-bold text-center">
        Features
      </h2>

      <div className="grid grid-cols-3 gap-8 mt-12">
        <div>
          <h3>AI Resume Analyzer</h3>
          <p>Analyse resumes and improve ATS scores.</p>
        </div>

        <div>
          <h3>Mock Interviews</h3>
          <p>Practice technical and HR interviews.</p>
        </div>

        <div>
          <h3>Career Roadmaps</h3>
          <p>Get personalised career recommendations.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;