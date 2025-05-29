import React, { useState } from "react";
import "./Blog.scss";

function Blog() {
  const [expandedId, setExpandedId] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "Understanding Criminal Law in India",
      shortDesc: "Learn about the basics of criminal law in India and how it affects citizens.",
      fullDesc: `Criminal cases involve actions considered offenses against the state or society, such as theft, assault, murder, or fraud. In such cases, the government prosecutes the accused, and if found guilty, the individual may face penalties like imprisonment, fines, or community service. These cases are intended to uphold law and order by punishing wrongdoers and deterring future crimes.`,
    },
    {
      id: 2,
      title: "Your Rights in a Civil Case",
      shortDesc: "Know your rights when involved in a civil lawsuit or dispute.",
      fullDesc: `Civil cases deal with disputes between individuals, organizations, or both, typically over rights, responsibilities, and obligations. Common examples include breach of contract, defamation, property disputes, or personal injury claims. Unlike criminal cases, civil matters usually involve monetary compensation or specific performance rather than punishment.`,
    },
    {
      id: 3,
      title: "What Happens During a Divorce?",
      shortDesc: "Explore the legal process and emotional challenges of divorce.",
      fullDesc: `Divorce and family cases revolve around matters like separation, child custody, maintenance, alimony, and division of assets. These cases are emotionally sensitive and often involve both civil and personal laws depending on religion or custom. Courts aim to resolve such disputes fairly while prioritizing the welfare of any children involved.`,
    },
    {
      id: 4,
      title: "All About Property Registration",
      shortDesc: "A guide to registering your property legally and safely.",
      fullDesc: `Property cases focus on legal disputes related to ownership, possession, or transfer of immovable and movable property. These may include land ownership issues, illegal possession, disputes over property inheritance, boundary conflicts, or property fraud. The court examines property titles, registration documents, and relevant laws to settle such disputes.`,
    },
    {
      id: 5,
      title: "All About constitutional cases",
      shortDesc: "A guide to registering your property legally and safely.",
      fullDesc: `Constitutional cases arise when there is a question involving the interpretation or application of the Constitution. These cases typically address fundamental rights, separation of powers, the validity of laws, or the functioning of government institutions. The judiciary plays a crucial role in ensuring that any legislative or executive action complies with constitutional principles.`,
    }
  ];

  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="blog" id="blog">
      <div className="container">
        <h2 className="blog-title">Explore Legal Topics</h2>
        <p className="blog-desc">Stay informed with our expert-written articles on various areas of law.</p>
        <div className="blog-cards">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <h3>{blog.title}</h3>
              <p>{blog.shortDesc}</p>
              <button onClick={() => toggleReadMore(blog.id)}>
                {expandedId === blog.id ? "Show Less" : "Read More"}
              </button>
              {expandedId === blog.id && <p className="full-content">{blog.fullDesc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
