/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToggleButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import UTMTarget from './UTMTarget';
import UTMChoice from './UTMChoice';
import UTMTextField from './UTMTextField';
import ConfigEditor from './ConfigEditor';
import LinkAlert from './LinkAlert';
import { UtmParams, defaultUtmParams } from './types';

function LinkForm() {
  const [config, setConfig] = useState(defaultUtmParams);
  const [validated, setValidated] = useState(false);
  const [utmCampaign, setUTMCampaign] = useState('');
  const [utmSource, setUTMSource] = useState('');
  const [utmTarget, setUTMTarget] = useState('');
  const [utmMedium, setUTMMedium] = useState('');
  const [utmTerm, setUTMTerm] = useState('');
  const [linkType, setLinkType] = useState('');
  const [fullLink, setFullLink] = useState('');
  const [typePrefix, setTypePrefix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [baseTarget, setBaseTarget] = useState('Pick a base target');
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [useBitly, setUseBitly] = useState(true);
  const [editedConfig, setEditedConfig] = useState(defaultUtmParams);
  const ref = useRef(null);

  const handleUtmSource = (value: string) => {
    console.log(`handleUtmSource: ${value}`);
    setUTMSource(value);
  };
  const handleUtmCampaign = (value: string) => {
    console.log('UtmCampaign: ', value);
    setUTMCampaign(value);
  };
  const handleUtmTarget = (value: string) => {
    console.log('UtmTarget: ', value);
    setUTMTarget(value);
  };
  const handleBaseTarget = (value: string) => {
    console.log('BaseTarget: ', value);
    setBaseTarget(value);
  };

  const clearForm = () => {
    setUTMCampaign('');
    setUTMSource('');
    setLinkType('');
    setFullLink('');
    setTypePrefix(false);
    setCopied(false);
    setBaseTarget('Pick a base target');
    setValidated(false);
    setUTMSource('');
    setShowLink(false);
  };

  const resetForm = () => {
    clearForm();
  };

  const handleConfig = (
    hideDialog: boolean,
    updateConfig: boolean,
    newConfig: UtmParams
  ) => {
    console.log('handleConfig: ', hideDialog, updateConfig, newConfig);
    if (updateConfig) {
      console.log('New Config: ', newConfig);
      console.log('Config: ', JSON.stringify(newConfig));
      window.electronAPI
        .saveConfig(null, JSON.stringify(newConfig))
        .then((response: JSON) => {
          setConfig(response);
          console.log('Saved config: ', response);
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
    }
    setShow(hideDialog);
  };

  const handleCloseAlert = () => {
    setShowLink(false);
    clearForm();
  };

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        console.log(response);
        setConfig(response);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  useEffect(() => {
    console.log('useEffect: ', config);
    setEditedConfig(config);
  }, [config]);

  const handleShow = () => setShow(true);
  const handleShowLink = () => setShowLink(true);

  const handleSubmit = (event: Event) => {
    console.log('handleSubmit');
    const form = event.currentTarget;
    if (!form) {
      return;
    }
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      console.log(config);
    } else {
      setValidated(true);
      event.preventDefault();
      const uname = utmCampaign.toLowerCase().replace(/ /g, '_');
      const lt = utmTarget === '-' ? '' : utmTarget;
      // add trailing slash to target if missing
      const target = lt.endsWith('/') ? lt : `${lt}/`;
      // trim the source if they entered a full URL
      const usource = utmSource.replace(/https?:\/\//, '');
      // remove trailing slash from source if present
      const source = usource.endsWith('/') ? usource.slice(0, -1) : usource;
      let finalLink = `${target}?utm_source=${source}&utm_term=${utmTerm}&utm_medium=${utmMedium}&utm_campaign=${uname}`;
      if (config.utm_target.RestrictBases) {
        finalLink = `${baseTarget}${lt}?utm_source=${utmSource}&utm_term=${utmTerm}&utm_medium=${utmMedium}&utm_campaign=${uname}`;
      }
      const regex = new RegExp('(^http[s]*://)|(^ftp[s]*://)');
      if (!regex.test(finalLink)) {
        finalLink = `https://${finalLink}`;
      }
      setFullLink(finalLink);
      if (useBitly) {
        const headers = {
          Authorization: 'Bearer 5ac621cc74757be94d9377b1a516405c7b33e53e',
          Accept: 'application/json',
          ContentType: 'application/json; charset=utf-8',
        };
        const data = JSON.parse(
          `{"long_url": "${finalLink}", "domain": "stree.ai"}`
        );
        // eslint-disable-next-line promise/catch-or-return
        axios
          .post('https://api-ssl.bitly.com/v4/shorten', data, {
            headers,
          })
          // eslint-disable-next-line promise/always-return
          .then((response) => {
            console.log('Bitly Response: ', response);
            setFullLink(response.data.link);
          });
      }
      console.log('Full Link: ', fullLink);
      setShowLink(true);
    }
    // setValidated(true);
  };

  return (
    <>
      <div id="link-form" className="content">
        {showLink && (
          <LinkAlert
            finalLink={fullLink}
            show={showLink}
            handleClose={handleCloseAlert}
            // clearForm={clearForm}
          />
        )}
        <Form
          noValidate
          validated={validated}
          onSubmit={(event) => handleSubmit(event)}
        >
          {/* Campaign input */}
          <UTMTextField
            valueChanged={handleUtmCampaign}
            utmParams={config.utm_campaign}
            targetType="utm_campaign"
            val={validated}
          />
          <br />
          {/* Source input */}
          <UTMTextField
            valueChanged={handleUtmSource}
            utmParams={config.utm_source}
            targetType="utm_source"
            val={validated}
          />
          <br />
          {/* Target input */}
          <UTMTarget
            valueChanged={handleUtmTarget}
            originValue={handleBaseTarget}
            utmParams={config.utm_target}
            val={validated}
            type="utm_target"
          />
          <br />
          {/* Term input */}
          <UTMChoice
            valueChanged={setUTMTerm}
            utmParams={config.utm_term}
            val={validated}
            type="utm_term"
            enabled
          />
          <br />
          {/* Medium input */}
          <UTMChoice
            valueChanged={setUTMMedium}
            utmParams={config.utm_medium}
            val={validated}
            type="utm_medium"
            enabled={utmTerm !== '' && utmTerm !== 'Choose one ...'}
          />
          <br />
          <Form.Group>
            <Button key="submit" variant="primary" type="submit">
              Submit
            </Button>
            &nbsp;&nbsp;
            <Button
              key="reset"
              variant="outline-primary"
              type="reset"
              onClick={resetForm}
            >
              Reset
            </Button>
            &nbsp;&nbsp;
            <div
              style={{
                marginRight: '-1rem',
                verticalAlign: 'top',
                textAlign: 'right',
              }}
            >
              <OverlayTrigger
                key="bitly-overlay"
                container={ref}
                placement="top"
                overlay={
                  <Tooltip id="tooltip-bitly">
                    <strong>
                      Check this box to use the StarTree Bitly Link Shortener
                    </strong>
                    .
                  </Tooltip>
                }
              >
                <Form.Check
                  type="checkbox"
                  ref={ref}
                  id="use-bitly"
                  inline
                  label="Use Bitly to shorten link"
                  checked={useBitly}
                  onChange={(e) => {
                    setUseBitly(e.target.checked);
                  }}
                />
              </OverlayTrigger>
            </div>
          </Form.Group>
        </Form>
        <br />
        <Form>
          <Form.Group>
            <OverlayTrigger
              key="bitly-overlay"
              placement="top"
              container={ref.current}
              overlay={
                <Tooltip id="tooltip-bitly">
                  <strong>
                    Click here to edit the configuration for this form
                  </strong>
                  .
                </Tooltip>
              }
            >
              <ToggleButton
                ref={ref}
                className="mb-2"
                size="sm"
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
                checked={show}
                value="1"
                onChange={(e) => {
                  console.log('e.target.checked: ', e.target.checked);
                  setEditedConfig(config);
                  handleShow();
                }}
              >
                Edit Config
              </ToggleButton>
            </OverlayTrigger>
          </Form.Group>
        </Form>
        {show && (
          <ConfigEditor
            utmParams={editedConfig}
            showMe={show}
            callDone={handleConfig}
          />
        )}
      </div>
    </>
  );
}

export default LinkForm;
