import { Badge, Body, Header, Root, Title, Value } from '../../ui';

import Accordion from '../../containers/Accordion';
import CodeableConcept from '../../datatypes/CodeableConcept';
import Date from '../../datatypes/Date';
import HeaderIcon from '../../datatypes/HeaderIcon';
import PropTypes from 'prop-types';
import React from 'react';
import Reference from '../../datatypes/Reference';
import _get from 'lodash/get';
import _has from 'lodash/has';
import fhirVersions from '../fhirResourceVersions';

const commonDTO = fhirResource => {
  const codeText =
    _get(fhirResource, 'code.coding.0.display') ||
    _get(fhirResource, 'code.text') ||
    _get(fhirResource, 'code.coding.0.code');
  const severityText =
    _get(fhirResource, 'severity.coding.0.display') ||
    _get(fhirResource, 'severity.text');
  const onsetDateTime = _get(fhirResource, 'onsetDateTime');
  const hasAsserter = _has(fhirResource, 'asserter');
  const asserter = _get(fhirResource, 'asserter');
  const hasBodySite = _get(fhirResource, 'bodySite.0.coding.0.display');
  const bodySite = _get(fhirResource, 'bodySite');

  return {
    codeText,
    severityText,
    onsetDateTime,
    hasAsserter,
    asserter,
    hasBodySite,
    bodySite,
  };
};
const dstu2DTO = fhirResource => {
  const clinicalStatus = _get(fhirResource, 'clinicalStatus');
  const dateRecorded = _get(fhirResource, 'dateRecorded');
  return {
    clinicalStatus,
    dateRecorded,
  };
};

const stu3DTO = fhirResource => {
  const clinicalStatus = _get(fhirResource, 'clinicalStatus');
  const dateRecorded = _get(fhirResource, 'assertedDate');
  return {
    clinicalStatus,
    dateRecorded,
  };
};

const r4DTO = fhirResource => {
  const clinicalStatus = _get(fhirResource, 'clinicalStatus.coding.0.code');
  const dateRecorded = _get(fhirResource, 'recordedDate');
  return {
    clinicalStatus,
    dateRecorded,
  };
};

const resourceDTO = (fhirVersion, fhirResource) => {
  switch (fhirVersion) {
    case fhirVersions.DSTU2: {
      return {
        ...commonDTO(fhirResource),
        ...dstu2DTO(fhirResource),
      };
    }
    case fhirVersions.STU3: {
      return {
        ...commonDTO(fhirResource),
        ...stu3DTO(fhirResource),
      };
    }
    case fhirVersions.R4: {
      return {
        ...commonDTO(fhirResource),
        ...r4DTO(fhirResource),
      };
    }

    default:
      throw Error('Unrecognized the fhir version property type.');
  }
};
function Condition(props) {
  const { fhirResource, fhirVersion, fhirIcons } = props;

  const {
    codeText,
    severityText,
    onsetDateTime,
    hasAsserter,
    asserter,
    hasBodySite,
    bodySite,
    clinicalStatus,
    dateRecorded,
  } = resourceDTO(fhirVersion, fhirResource);

  const headerIcon = fhirIcons[_get(fhirResource, 'resourceType')];

  return (
    <Root name="condition">
      <Accordion
        headerContent={
          <Header
            resourceName="Condition"
            icon={
              <div className="px-sm-1">
                <HeaderIcon />
              </div>
            }
            badgeStatus={clinicalStatus}
            badge={<Badge data-testid="clinicalStatus">{clinicalStatus}</Badge>}
            titleSegment={
              <>
                <Title>{codeText || ''}</Title>
                {severityText && (
                  <div data-testid="severity">{severityText} severity</div>
                )}
              </>
            }
          />
        }
        bodyContent={
          <Body>
            {onsetDateTime && (
              <Value label="Onset Date" data-testid="onsetDate">
                <Date fhirData={onsetDateTime} />
              </Value>
            )}
            {dateRecorded && (
              <Value label="Date recorded" data-testid="dateRecorded">
                <Date fhirData={dateRecorded} />
              </Value>
            )}
            {hasAsserter && (
              <Value label="Asserted by" data-testid="asserter">
                <Reference fhirData={asserter} />
              </Value>
            )}
            {hasBodySite && (
              <Value label="Anatomical locations" data-testid="bodySite">
                <CodeableConcept fhirData={bodySite} />
              </Value>
            )}
          </Body>
        }
      />
    </Root>
  );
}

Condition.propTypes = {
  fhirResource: PropTypes.shape({}).isRequired,
  fhirVersion: PropTypes.oneOf([
    fhirVersions.DSTU2,
    fhirVersions.STU3,
    fhirVersions.R4,
  ]).isRequired,
};

export default Condition;
