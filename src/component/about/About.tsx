import { contentListArray } from "../../helpers/classses";
import { aboutBodyText, aboutTitle } from "../../helpers/constants";
import "./About.css";
function About() {
  return (
    <div className="about">
      <div className="about-wrapper"></div>
      <div className="about-content">
        <div className="about-content-item">
          <div className="about-content-item-wrapper">
            <h1>{aboutTitle}</h1>
            <p>{aboutBodyText}</p>
          </div>

          {contentListArray?.map((content) => (
            <div>
              <div
                key={
                  Array.isArray(content.title)
                    ? content.title.join(",")
                    : content.title ?? ""
                }
                className="about-content-title"
              >
                {content.title}
              </div>
              <div
                key={
                  Array.isArray(content.subTitle)
                    ? content.subTitle.join(",")
                    : content.subTitle ?? ""
                }
                className="about-content-subtitle-array"
              >
                {Array.isArray(content.subTitle) &&
                Array.isArray(content.description) &&
                content.subTitle.length > 0 &&
                content.description.length > 0 ? (
                  content.subTitle.map((sub, num) => (
                    <div key={sub} className="about-content-subtitle-item">
                      {content.description[num]}:
                      <span className="about-content-subtitle-item-description">
                        {sub}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="about-content-subtitle">
                      {content.subTitle}
                    </div>
                    <span className="about-content-description">
                      {Array.isArray(content.description) ? (
                        content.description.map((desc) => (
                          <div
                            key={desc}
                            className="about-content-desc-item-description"
                          >
                            {desc}
                          </div>
                        ))
                      ) : (
                        <span className="content-description">
                          {content.description}
                        </span>
                      )}
                    </span>
                    <br />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
