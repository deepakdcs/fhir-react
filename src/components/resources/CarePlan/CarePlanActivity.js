import React from 'react';
import PropTypes from 'prop-types';
import Coding from '../../datatypes/Coding';

const CarePlanActivity = props => {
  const { title = '', hasCategories, categories } = props.fhirData;
  return (
    <div className="fhir-resource__CarePlan__activity mb-2">
      <div className="fhir-resource__CarePlan__activity-title fw-bold">
        {title
          .toLowerCase()
          .replace(/./, firstLetter => firstLetter.toUpperCase())}
      </div>
      {hasCategories &&
        categories.map((coding, i) => (
          <Coding key={`item-${i}`} fhirData={coding} />
        ))}
    </div>
  );
};

CarePlanActivity.propTypes = {
  fhirData: PropTypes.shape({
    title: PropTypes.string,
    hasCategories: PropTypes.bool.isRequired,
    categories: PropTypes.array,
  }),
};

export default CarePlanActivity;
