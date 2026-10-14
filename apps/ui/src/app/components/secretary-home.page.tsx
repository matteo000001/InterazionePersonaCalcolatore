import { useEffect, useState } from 'react';
import {createCurrentSession,fetchCurrentSession,saveCurrentSession,} from './secretary.api';
import {defaultSessionForm,SessionFormState,} from './secretary-dashboard.types';

export function SecretaryHomePage() {
  const [sessionForm, setSessionForm] =
    useState<SessionFormState>(defaultSessionForm);
  const [hasCurrentSession, setHasCurrentSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentSession() {
      setLoading(true);
      setError(null);

      try {
        const currentSession = await fetchCurrentSession();
        setSessionForm({
          sessionStart: currentSession.sessionStart,
          sessionEnd: currentSession.sessionEnd,
          planningStart: currentSession.planningStart,
          planningEnd: currentSession.planningEnd,
          excludedHolidayDates: currentSession.excludedHolidayDates,
        });
        setHasCurrentSession(true);
      } catch {
        setSessionForm(defaultSessionForm);
        setHasCurrentSession(false);
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentSession();
  }, []);

  function updateSessionField(field: keyof SessionFormState, value: string) {
    setSessionForm((current) => ({
      ...current,
      [field]:
        field === 'excludedHolidayDates'
          ? value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : value,
    }));
  }

  async function handleSaveSession() {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedSession = hasCurrentSession
        ? await saveCurrentSession(sessionForm)
        : await createCurrentSession(sessionForm);

      setSessionForm({
        sessionStart: updatedSession.sessionStart,
        sessionEnd: updatedSession.sessionEnd,
        planningStart: updatedSession.planningStart,
        planningEnd: updatedSession.planningEnd,
        excludedHolidayDates: updatedSession.excludedHolidayDates,
      });
      setHasCurrentSession(true);
      setSuccessMessage(
        hasCurrentSession
          ? 'Configurazione sessione aggiornata'
          : 'Sessione esami creata'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operazione non riuscita');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <section className="session-home">Caricamento sessione...</section>;
  }

  return (
    <section className="session-home">
      {error ? <div className="alert error">{error}</div> : null}
      {successMessage ? <div className="alert success">{successMessage}</div> : null}

      <div className="panel session-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Pannello segreteria</p>
            <h2>Configurazione sessione</h2>
          </div>
        </div>

        <div className="session-config-grid">
          <div className="session-config-group">
            <h3>Sessione esami</h3>
            <div className="session-date-row">
              <label>
                Inizio sessione
                <input
                  type="date"
                  value={sessionForm.sessionStart}
                  onChange={(event) =>
                    updateSessionField('sessionStart', event.target.value)
                  }
                />
              </label>

              <label>
                Fine sessione
                <input
                  type="date"
                  value={sessionForm.sessionEnd}
                  onChange={(event) =>
                    updateSessionField('sessionEnd', event.target.value)
                  }
                />
              </label>
            </div>
          </div>

          <div className="session-config-group">
            <h3>Finestra pianificazione</h3>
            <div className="session-date-row">
              <label>
                Inizio pianificazione
                <input
                  type="date"
                  value={sessionForm.planningStart}
                  onChange={(event) =>
                    updateSessionField('planningStart', event.target.value)
                  }
                />
              </label>

              <label>
                Fine pianificazione
                <input
                  type="date"
                  value={sessionForm.planningEnd}
                  onChange={(event) =>
                    updateSessionField('planningEnd', event.target.value)
                  }
                />
              </label>
            </div>
          </div>
        </div>

        <label className="holiday-field">
          Festivita escluse opzionali
          <input
            type="text"
            value={sessionForm.excludedHolidayDates.join(', ')}
            onChange={(event) =>
              updateSessionField('excludedHolidayDates', event.target.value)
            }
            placeholder="2026-04-25, 2026-05-01"
          />
        </label>

        <button
          type="button"
          className="primary session-save"
          onClick={() => void handleSaveSession()}
          disabled={isSubmitting}
        >
          {hasCurrentSession
            ? 'Salva configurazione sessione'
            : 'Crea sessione esami'}
        </button>
      </div>
    </section>
  );
}
