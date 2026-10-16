import { at, cx } from './Stage'
import './show.css'
import './products.css'

/*
 * The two service products (and Privacy Guardian's Live Desktop), drawn in
 * their own looks. Shared by the gallery, the services index and the
 * scroll-driven stories on each product page.
 */

/* ================================================================== *
 * Privacy Guardian — someone at your laptop; one tap on your phone.
 * Steps 0–3 lock everything; 4–5 (the product page) unlock one thing.
 * ================================================================== */

export const GUARDIAN_STEPS = [2000, 750, 550, 3800]

export function Guardian({ step }: { step: number }) {
  const on = at(step)
  const unlocked = on(5)
  const locked = on(3) && !unlocked
  const status = unlocked
    ? '1 resource temporarily unlocked.'
    : locked
      ? 'Private environment locked.'
      : '2 resources temporarily unlocked.'
  return (
    <div className="pgs">
      <div className="pgs__laptop">
        <div className="pgs__lid">
          <div className="pgs__screen">
            <div className="pgs__tabs">
              <span className={cx(!locked && 'is-on')}>
                <i style={{ background: '#25d366' }} /> WhatsApp
              </span>
              <span>
                <i style={{ background: '#ea4335' }} /> Inbox
              </span>
              <span>
                <i style={{ background: '#ff0033' }} /> YouTube
              </span>
            </div>
            <div className="pgs__url">{locked ? 'web.whatsapp.com · locked' : 'web.whatsapp.com'}</div>
            <div className="pgs__page">
              <div className={cx('pgs__chat', locked && 'is-gone')}>
                <aside>
                  {['Mom', 'Project group', 'Priya', 'Placement cell'].map((n, i) => (
                    <span key={n} className={cx(i === 2 && 'is-on')}>
                      <i />
                      {n}
                    </span>
                  ))}
                </aside>
                <div>
                  <p className="pgs__b">Did you send the report?</p>
                  <p className="pgs__b pgs__b--me">Sending it tonight</p>
                  <p className="pgs__b">Ok — don’t share the link with anyone</p>
                </div>
              </div>
              <div className={cx('pgs__lock', locked && 'is-on')}>
                <span className="pgs__shield">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                    <rect x="9" y="10.5" width="6" height="5" rx="1" />
                    <path d="M10 10.5V9a2 2 0 0 1 4 0v1.5" />
                  </svg>
                </span>
                <strong>This site is locked</strong>
                <small>Privacy Guardian · ask the owner to unlock it</small>
                <span className="pgs__also">
                  <i>Incognito</i>
                  <i>New profile</i>
                  <i>Desktop app</i>
                  <i>Folder</i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pgs__base" />
      </div>

      <div className="pgs__phone">
        <div className="pgs__ps">
          <span className="pgs__time">9:41</span>
          <span className="pgs__app">
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
              </svg>
            </i>
            <span>
              <small>Privacy Guardian</small>
              My Laptop
            </span>
          </span>
          <div className="pgs__card">
            <span className={cx('pgs__pill', locked && 'is-locked')}>Protected</span>
            <p>{status}</p>
          </div>
          <span className="pgs__k">Open on the laptop</span>
          {[
            ['WhatsApp Web', '#25d366'],
            ['Gmail', '#ea4335'],
          ].map(([n, c], i) => {
            const isLocked = locked || (unlocked && i === 1)
            return (
              <div className="pgs__row" key={n}>
                <i style={{ background: c }} />
                {n}
                <em className={cx(isLocked && 'is-locked', unlocked && i === 0 && 'is-open')}>
                  {isLocked ? 'Locked' : unlocked ? 'Unlocked' : 'Open'}
                </em>
              </div>
            )
          })}
          <div className="pgs__row pgs__row--free">
            <i style={{ background: '#ff0033' }} />
            YouTube
            <em>Free</em>
          </div>
          <button type="button" tabIndex={-1} className={cx('pgs__btn', on(1) && !on(3) && 'is-press')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Lock Private
          </button>
          <span className={cx('pgs__tap', on(1) && !on(2) && 'is-on')} />
          <span className={cx('pgs__toast', on(3) && !on(4) && 'is-on')}>Locked — 2 resources</span>
          <span className={cx('pgs__toast', 'pgs__toast--open', unlocked && 'is-on')}>Unlocked — WhatsApp Web</span>

          <div className={cx('pgs__sheet', on(4) && !unlocked && 'is-on')}>
            <span className="pgs__sk">Authentication required</span>
            <strong>Approve access to WhatsApp Web on My Laptop</strong>
            <span className="pgs__fp">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 7.5a7 7 0 0 1 11 0" />
                <path d="M5 11a7 7 0 0 1 14 0v1.5" />
                <path d="M8 19c1-1.5 1.5-3.5 1.5-6.5a2.5 2.5 0 0 1 5 0c0 3-.5 5.5-1.5 7.5" />
                <path d="M12 12.5c0 3-.6 5.6-1.8 7.5" />
              </svg>
            </span>
            <small>Touch the fingerprint sensor</small>
          </div>
        </div>
      </div>

      <span className={cx('pgs__beam', on(2) && !on(3) && 'is-on')} />
      <span className={cx('pgs__beam', 'pgs__beam--open', unlocked && 'is-on')} />
    </div>
  )
}

/* ================================================================== *
 * Mediator — the AI asks for a tool; Mediator runs it and answers back.
 * Steps 0–4 fix a bug; 5 (the product page) asks before a force-push.
 * ================================================================== */

export const MEDIATOR_STEPS = [900, 1200, 1300, 1200, 3600]

const PHASES = ['ChatGPT thinking', 'ChatGPT → Mediator', 'Mediator → ChatGPT', 'Mediator → System', 'Mediator → ChatGPT', 'Waiting for approval']

export function MediatorShow({ step }: { step: number }) {
  const on = at(step)
  const asking = on(5)
  return (
    <div className="mds">
      <div className="mds__chat">
        <div className="mds__bar">
          <i />
          <i />
          <i />
          <span>chatgpt.com</span>
          <b className="mds__ext">M</b>
        </div>
        <div className="mds__log">
          <p className={cx('mds__you', 'sh', on(0) && 'is-on')}>The login test fails after the refactor. Fix it.</p>
          <div className={cx('mds__ai', 'sh', on(1) && 'is-on')}>
            <p>I’ll run the tests first.</p>
            <pre className="mds__fence">
              <span>mediator</span>
              {'{"v":1,"calls":[{"tool":"run_tests","path":"tests"}]}'}
            </pre>
          </div>
          <pre className={cx('mds__res', 'mds__res--bad', 'sh', on(2) && 'is-on')}>
            <span>--- MEDIATOR_TOOL_RESULT_OUTPUT ---</span>
            {'run_tests: 1 failed, 41 passed\ntest_login_refresh · AssertionError'}
          </pre>
          <div className={cx('mds__ai', 'sh', on(3) && 'is-on')}>
            <p>Refresh compares against the wrong expiry. Fixing it.</p>
            <pre className="mds__fence">
              <span>mediator</span>
              {'{"v":1,"calls":[{"tool":"edit_file","path":"src/auth/session.py"}]}'}
            </pre>
          </div>
          <pre className={cx('mds__res', 'mds__res--ok', 'sh', on(4) && 'is-on')}>
            <span>--- MEDIATOR_TOOL_RESULT_OUTPUT ---</span>
            {'edit_file: session.py +1 −1\nrun_tests: 42 passed'}
          </pre>
          {asking && (
            <div className="mds__ai sh is-on">
              <p>Tests pass. Pushing the fix.</p>
              <pre className="mds__fence">
                <span>mediator</span>
                {'{"v":1,"calls":[{"tool":"run_command","cmd":"git push --force origin main"}]}'}
              </pre>
            </div>
          )}
        </div>
        <div className="mds__input">Message ChatGPT</div>
      </div>

      <div className="mds__panel">
        <div className="mds__ph">
          <span className="mds__mark">M</span> Mediator
          <span className="mds__live">● connected</span>
        </div>
        <div className={cx('mds__phase', on(4) && !asking && 'is-ok', asking && 'is-wait')}>
          <i /> {PHASES[Math.min(step, PHASES.length - 1)]}
        </div>
        <span className="mds__k">Live activity</span>
        <ul className="mds__act">
          <li className={cx('sh', on(2) && 'is-on')}>
            <code>run_tests</code> 1 failed, 41 passed
          </li>
          <li className={cx('sh', on(4) && 'is-on')}>
            <code>edit_file</code> session.py <b className="add">+1</b> <b className="del">−1</b>
          </li>
          <li className={cx('sh', on(4) && 'is-on')}>
            <code>run_tests</code> <b className="add">42 passed</b>
          </li>
        </ul>
        {asking ? (
          <div className="mds__ask">
            <span className="mds__askh">
              Permission needed <em>significant</em>
            </span>
            <p>force-push overwrites remote history; confirm intent</p>
            <code>git push --force origin main</code>
            <span className="mds__btns">
              <i className="ok">Allow</i>
              <i className="no">Don’t allow</i>
            </span>
          </div>
        ) : (
          <div className={cx('mds__ver', 'sh', on(4) && 'is-on')}>
            <span>Verification</span>
            <strong>✓ Current code verified</strong>
          </div>
        )}
        <div className="mds__rules">
          <span>
            <code>pytest</code> runs
          </span>
          <span>
            <code>git push --force</code> asks you
          </span>
          <span>
            <code>rm -rf /</code> blocked
          </span>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Live Desktop — the laptop's real screen on the phone; tap, type, close.
 * ================================================================== */

export const LIVE_STEPS = [1600, 900, 1300, 1100, 1300, 3200]

/** The laptop's screen: a college form in Chrome, with Spotify left open behind it. */
function LiveScreen({ step, mirror = false }: { step: number; mirror?: boolean }) {
  const on = at(step)
  return (
    <div className={cx('lvs__desk', mirror && 'is-mirror')}>
      <div className={cx('lvs__spot', on(5) && 'is-gone')}>
        <span>Spotify</span>
        <i />
        <i />
      </div>
      <div className="lvs__win">
        <div className="lvs__wbar">
          <i />
          <i />
          <i />
          <span>portal.college.edu/internship</span>
        </div>
        <div className="lvs__form">
          <strong>Summer internship — application</strong>
          <small>Closes today, 5:00 PM</small>
          <span className="lvs__label">Roll number</span>
          <span className={cx('lvs__field', on(1) && 'is-focus')}>
            {on(2) ? '21CS042' : ''}
            {on(1) && !on(3) && <b className="lvs__caret" />}
          </span>
          <span className={cx('lvs__submit', on(3) && 'is-done')}>{on(3) ? '✓ Submitted at 4:53 PM' : 'Submit application'}</span>
        </div>
      </div>
      <div className="lvs__task">
        <i className="is-chrome" />
        <i className={cx('is-spot', on(5) && 'is-gone')} />
      </div>
    </div>
  )
}

export function LiveShow({ step }: { step: number }) {
  const on = at(step)
  const tap = on(1) && !on(2) ? 'is-field' : on(3) && !on(4) ? 'is-submit' : ''
  return (
    <div className="lvs">
      <div className="lvs__laptop">
        <div className="lvs__lid">
          <LiveScreen step={step} />
        </div>
        <div className="lvs__base" />
        <span className="lvs__tag">Your laptop · in the library</span>
      </div>

      <div className="lvs__phone">
        <div className="lvs__ps">
          <span className="lvs__title">
            <b /> Live Desktop
            <span className="lvs__acts">
              <i className="pause" />
              <i className="kbd" />
              <i className={cx('list', on(4) && !on(5) && 'is-on')} />
            </span>
          </span>
          <div className="lvs__mirror">
            <div className={cx('lvs__mz', on(1) && 'is-zoom')}>
              <LiveScreen step={step} mirror />
            </div>
            <span className={cx('lvs__tap', tap)} />
            <span className={cx('lvs__pinch', !on(1) && 'is-on')}>Pinch to zoom</span>
          </div>
          <span className="lvs__keys">
            <i>Esc</i>
            <i>Tab</i>
            <i>⌫</i>
            <i>Enter</i>
            <i className="sw">Switch app</i>
          </span>
          <div className={cx('lvs__type', on(2) && 'is-on')}>{on(2) ? '21CS042' : 'Type text to send to laptop...'}</div>
          <div className="lvs__bar">
            <i className="lock">Lock Private</i>
            <i>Type</i>
            <i className="ms" />
            <i className="ms ms--r" />
          </div>

          <div className={cx('lvs__sheet', on(4) && !on(5) && 'is-on')}>
            <strong>What is open</strong>
            <span className="lvs__sk">Open applications</span>
            <div className="lvs__app">
              Google Chrome
              <small>Summer internship — application</small>
            </div>
            <div className="lvs__app">
              Spotify
              <small>Playing</small>
              <span>
                <i>Lock</i>
                <i className="close">Close</i>
              </span>
            </div>
            <div className="lvs__app lvs__app--sys">
              File Explorer
              <small>Part of Windows — cannot be locked.</small>
            </div>
          </div>
          <span className={cx('lvs__toast', on(5) && 'is-on')}>Closed Spotify.</span>
        </div>
      </div>
    </div>
  )
}
