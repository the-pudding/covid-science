import React from 'react';
import './SectionHero.scoped.scss';

const SectionHero = (props) => {
    return (
        <div className={props.rootClassName}>
            <div className="title-container">
                <h1 className="title">Following the Science</h1>
                <div className="subtitle">
                A look at the global research effort to combat the coronavirus pandemic
        </div>
                <div className="byline">
                    By{' '}
                    <a href="https://pudding.cool/author/jeff-macinnes" target="_blank">
                        Jeff MacInnes
          </a>
                </div>
            </div>
        </div>
    );
};

export default SectionHero;
