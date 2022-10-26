import './hyde.css';

export default function MainHeader() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <main className="content">
      <div className="posts">
        <article className="post">
          <h1 className="post-title">Create a Link</h1>
          <h4>Posting a link back to a web resource?</h4>
          <h4>Create a trackable link and make it count!</h4>
          {/* <div style={{ textAlign: 'left' }}>
            <p />
            <strong>Enter information about your link:</strong>
            <ul>
              <li>Your full name</li>
              <li>The source: where the link will be posted</li>
              <li>The target: where the link will take readers to</li>
              <li>
                The base URL: which Camunda property are you pointing back to?
              </li>
              <ul>
                <li>
                  The target: where are you pointing to? If it&apos;s to the
                  base URL, just enter &apos;-&apos;
                </li>
              </ul>
              <li>Your division: what division or group are you in?</li>
              <li>Referral type: what kind of post is this?</li>
            </ul>
          </div> */}
        </article>
      </div>
    </main>
  );
}
