/* eslint-disable no-case-declarations */
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Accordion, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Pill from './Pills/Pill';
import { defaultUtmParams, UtmParams, ValueList } from './types';

export default function ConfigEditor({
  utmParams,
  showMe,
  callDone,
}: {
  utmParams: UtmParams;
  showMe: boolean;
  callDone: (
    hideDialog: boolean,
    updateConfig: boolean,
    newConfig: UtmParams
  ) => void;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState(defaultUtmParams);
  const [baseVal, setBaseVal] = useState('');
  const [termVal, setTermVal] = useState('');
  const [mediumVal, setMediumVal] = useState('');
  const [targetValidated, setTargetValidated] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* delete a Target pill. This is used as a callback to the Pill component */
  const deleteTargetPill = ({ target }: { target: string }) => {
    const oldBases: [ValueList] = config.utm_target.value;
    oldBases.forEach((v: ValueList, index): void => {
      if (v.value === target) {
        oldBases.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTarget = {
            ...newConfig.utm_target,
          };
          newTarget.value = oldBases;
          newConfig.utm_target = newTarget;
          return newConfig;
        });
      }
    });
  };
  /* delete a Term pill. This is used as a callback to the Pill component */
  const deleteTermPill = ({ target }: { target: string }) => {
    const oldTerms: [ValueList] = config.utm_term.value;
    oldTerms.forEach((term: ValueList, index) => {
      if (term.value === target) {
        oldTerms.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = oldTerms;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
      }
    });
  };
  /* delete a Medium pill. This is used as a callback to the Pill component */
  const deleteMediumPill = ({ target }: { target: string }) => {
    const oldMediums: [ValueList] = config.utm_medium.value;
    oldMediums.forEach((term: ValueList, index) => {
      if (term.value === target) {
        oldMediums.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMedium = {
            ...newConfig.utm_medium,
          };
          newMedium.value = oldMediums;
          newConfig.utm_medium = newMedium;
          return newConfig;
        });
      }
    });
  };

  /* Add a new Target pill. This is used as a callback to the Pill component */
  const termPillElements = config.utm_term.value.map((term: ValueList) => (
    <Pill
      id={`utm_term-${term.id}`}
      value={term.value}
      type="utm_term"
      callback={deleteTermPill}
    />
  ));

  const mediumPillElements = config.utm_medium.value.map((med: ValueList) => (
    <Pill
      id={`utm_medium-${med.id}`}
      value={med.value}
      type="utm_medium"
      callback={deleteMediumPill}
    />
  ));

  const targetPillElements = config.utm_target.value.map((tar: ValueList) => (
    <Pill
      id={`utm_target-${tar.id}`}
      value={tar.value}
      type="utm_target"
      callback={deleteTargetPill}
    />
  ));

  /* add a pill. This is used as a callback to the values field in targets, terms and mediums */
  const createTermPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setTermVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val = v.replace(/,/g, '');
    const i = val.toLowerCase().replace(/ /g, '-');
    const terms: [ValueList] = config.utm_term.value;
    terms.push({ id: i, value: val });
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newTerm = {
        ...newConfig.utm_term,
      };
      newTerm.value = terms;
      newConfig.utm_term = newTerm;
      return newConfig;
    });
    setTermVal('');
  };
  const createMediumPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setMediumVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val: string = v.replace(/,/g, '');
    const id = val.toLowerCase().replaceAll(' ', '-');
    const mediums: [ValueList] = config.utm_medium.value;
    mediums.push({ id, value: val });
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newMedium = {
        ...newConfig.utm_medium,
      };
      newMedium.value = mediums;
      newConfig.utm_medium = newMedium;
      return newConfig;
    });
    setMediumVal('');
  };
  const createTargetPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setBaseVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val: string = v.replace(/,/g, '');
    if (val.search(/^http[s]*:\/\/|^ftp:\/\/ /) !== 0) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setTargetValidated(true);
      return;
    }
    let tID: string = val.replace(/^(http[s]*:\/\/)|(^ftp):\/\/ /g, '');
    tID = tID.replace(/[`~!@#$%^&*()_+={|\\\/?.,<>'";:} ]+/g, '-');
    const b: ValueList = { id: tID, value: val };
    const bases: [ValueList] = config.utm_target.value;
    bases.push(b);
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newTarget = {
        ...newConfig.utm_target,
      };
      newTarget.value = bases;
      newConfig.utm_target = newTarget;
      return newConfig;
    });
    setBaseVal('');
  };

  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    // eslint-disable-next-line react/destructuring-assignment
    callDone(!showMe, false, config);
  };

  /* handle the save button */
  const handleSave = (event: Event) => {
    const form = event.currentTarget;
    if (form != null && form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTargetValidated(true);
    callDone(!showMe, true, config);
  };

  /* keep configuration up to date */
  useEffect(() => {
    setConfig(utmParams);
  }, [utmParams]);

  useEffect(() => {
    setShow(showMe);
  }, [showMe]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleCancel}
        size="xl"
        dialogClassName="modal-90w"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Configuration Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <strong>utm_campaign</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_campaign">
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_campaign_label"
                    id="utm_campaign-label"
                    placeholder="Enter utm_campaign field label"
                    value={
                      config.utm_campaign.showName
                        ? `${config.utm_campaign.label} (utm_campaign)`
                        : `${config.utm_campaign.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.label = e.target.value;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_campaign-show"
                    // key="show-utm_campaign"
                    label="Show 'utm_campaign' in Field Label?"
                    checked={config.utm_campaign.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.showName = e.target.checked;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
                    }}
                  />
                  <br />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_campaign_tooltip"
                    id="utm_campaign-tooltip"
                    placeholder="Enter utm_campaign field tooltip"
                    value={config.utm_campaign.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.tooltip = e.target.value;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
                    }}
                  />
                  <br />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_campaign_aria"
                    id="utm_campaign-aria"
                    required
                    placeholder="Enter utm_campaign field ARIA (Accessibility) label"
                    value={config.utm_campaign.ariaLabel}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.ariaLabel = e.target.value;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
                    }}
                  />
                  <br />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_campaign_error"
                    id="utm_campaign-error"
                    placeholder="Enter utm_campaign field error message"
                    value={config.utm_campaign.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.error = e.target.value;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
                    }}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <strong>utm_source</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_source">
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_label"
                    id="utm_source-label"
                    placeholder="Enter utm_source field label"
                    value={
                      config.utm_source.showName
                        ? `${config.utm_source.label} (utm_source)`
                        : `${config.utm_source.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.label = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_source-show"
                    // key="show-utm_source"
                    label="Show 'utm_source' in Field Label?"
                    checked={config.utm_source.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.showName = e.target.checked;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_tooltip"
                    id="utm_source-tooltip"
                    placeholder="Enter utm_source field tooltip"
                    value={config.utm_source.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.tooltip = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_source-aria"
                    placeholder="Enter utm_source field ARIA (Accessibility) label"
                    value={config.utm_source.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.ariaLabel = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_source_error"
                    id="utm_source-error"
                    placeholder="Enter utm_source field error mesage"
                    value={config.utm_source.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.error = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <strong>utm_target</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_target">
                <Form noValidate validated={targetValidated}>
                  <Form.Group>
                    <Form.Label>
                      <strong>Label</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      // key="utm_target_label"
                      id="utm_target-label"
                      placeholder="Enter utm_target field label"
                      value={
                        config.utm_target.target_field.showName
                          ? `${config.utm_target.label} (utm_target)`
                          : `${config.utm_target.label}`
                      }
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.label = e.target.value;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Check
                      type="checkbox"
                      // key="show-utm_target"
                      id="utm_target-show"
                      label="Show 'utm_target' in Field Label?"
                      checked={config.utm_target.target_field.showName}
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          const newTargetField = { ...newTarget.target_field };
                          newTargetField.showName = e.target.checked;
                          newTarget.target_field = newTargetField;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Label>
                      <strong>ToolTip Text</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      // key="utm_target_tooltip"
                      id="utm_target-tooltip"
                      placeholder="Enter utm_target field tooltip"
                      value={config.utm_target.tooltip}
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.tooltip = e.target.value;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Label>
                      <strong>ARIA (Accessibility) Text</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      // key="utm_target_aria"
                      id="utm_target-aria"
                      placeholder="Enter utm_target field ARIA (Accessibility) label"
                      required
                      value={config.utm_target.target_field.ariaLabel}
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.target_field.ariaLabel = e.target.value;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Label>
                      <strong>Error Text</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      // key="utm_target_error"
                      id="utm_target-error"
                      placeholder="Enter utm_target field tooltip"
                      value={config.utm_target.error}
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.error = e.target.value;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    <Form.Check
                      type="checkbox"
                      id="utm_target-restrict_bases"
                      // key="restrict-bases"
                      label="Restrict base URLs for utm_targets?"
                      checked={config.utm_target.RestrictBases}
                      onChange={(e) => {
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.RestrictBases = e.target.checked;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
                      }}
                    />
                    {config.utm_target.RestrictBases && (
                      <Form.Group>
                        <Form.Label>
                          <strong>Base URLs</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          // key="utm_target-bases"
                          id="utm_target-bases"
                          placeholder="Enter comma-separated list of URLs to use for utm_target"
                          value={baseVal}
                          required
                          pattern="/^(http[s]*)|(^ftp):\/\/ /"
                          onChange={(eventKey) => {
                            createTargetPills(eventKey);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid URL! Please use a complete URL with http or
                          https.
                        </Form.Control.Feedback>
                        <br />
                        <div id="utm_target-values">{targetPillElements}</div>
                      </Form.Group>
                    )}
                  </Form.Group>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <strong>utm_term</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_term">
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_term_label"
                    id="utm_term-label"
                    placeholder="Enter utm_term field label"
                    value={
                      config.utm_term.showName
                        ? `${config.utm_term.label} (utm_term)`
                        : `${config.utm_term.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.label = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_term-show"
                    // key="show-utm_term"
                    label="Show 'utm_term' in Field Label?"
                    checked={config.utm_term.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.showName = e.target.checked;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_term_tooltip"
                    id="utm_term-tooltip"
                    placeholder="Enter utm_term field tooltip"
                    value={config.utm_term.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.tooltip = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_term_aria"
                    id="utm_term-aria"
                    placeholder="Enter utm_term field ARIA (Accessibility) label"
                    value={config.utm_term.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.ariaLabel = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_term_error"
                    id="utm_term-error"
                    placeholder="Enter utm_term field error mesage"
                    value={config.utm_term.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.error = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Terms</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_term_terms"
                    placeholder="Enter comma-separated list of terms to use"
                    value={termVal}
                    required
                    id="utm_term-values"
                    onChange={(eventKey) => {
                      createTermPills(eventKey);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one term.
                  </Form.Control.Feedback>
                  <br />
                  <div id="utm_term-pills">{termPillElements}</div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <strong>utm_medium</strong>
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_medium-label"
                    // key="utm_medium-label"
                    placeholder="Enter utm_medium field label"
                    value={
                      config.utm_medium.showName
                        ? `${config.utm_medium.label} (utm_medium)`
                        : `${config.utm_medium.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.label = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    // key="show-utm_medium"
                    id="show-utm-medium"
                    label="Show 'utm_medium' in Field Label?"
                    checked={config.utm_medium.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.showName = e.target.checked;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-tooltip"
                    id="utm_medium-tooltip"
                    placeholder="Enter utm_medium field tooltip"
                    value={config.utm_medium.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.tooltip = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-aria"
                    id="utm_medium-aria"
                    placeholder="Enter utm_medium field ARIA (Accessibility) label"
                    value={config.utm_medium.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.ariaLabel = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-error"
                    id="utm_medium-error"
                    placeholder="Enter utm_medium field error mesage"
                    value={config.utm_medium.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.error = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Medium Values</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_medium-values"
                    placeholder="Enter comma-separated list of values to use"
                    value={mediumVal}
                    required
                    id="utm_medium-values"
                    onChange={(eventKey) => {
                      createMediumPills(eventKey);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one value.
                  </Form.Control.Feedback>
                  <br />
                  <div key="utm_medium-pills" id="utm_medium-pills">
                    {mediumPillElements}
                  </div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfigEditor.propTypes = {
  utmParams: PropTypes.shape({
    utm_source: PropTypes.shape({
      label: PropTypes.string.isRequired,
      showName: PropTypes.bool.isRequired,
      tooltip: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
    }).isRequired,
    utm_campaign: PropTypes.shape({
      label: PropTypes.string.isRequired,
      showName: PropTypes.bool.isRequired,
      tooltip: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
    }).isRequired,
    utm_term: PropTypes.shape({
      label: PropTypes.string.isRequired,
      showName: PropTypes.bool.isRequired,
      tooltip: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    utm_medium: PropTypes.shape({
      label: PropTypes.string.isRequired,
      showName: PropTypes.bool.isRequired,
      tooltip: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    utm_target: PropTypes.shape({
      label: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
      RestrictBases: PropTypes.bool.isRequired,
      value: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          link: PropTypes.string,
        }).isRequired
      ).isRequired,
      target_field: PropTypes.shape({
        showName: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        ariaLabel: PropTypes.string.isRequired,
        tooltip: PropTypes.string.isRequired,
        error: PropTypes.string.isRequired,
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  callDone: PropTypes.func.isRequired,
  showMe: PropTypes.bool.isRequired,
};
