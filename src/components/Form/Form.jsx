import './Form.css';

export function Form({ data = [] }) {
  return (
    <form className="form-wrapper">
      {data.map((field, index) => (
        <div key={index} className="form-field">
          <label className="form-label">
            {field.label}{field.required && <span className="required"> *</span>}
          </label>

          {field.type === 'radio' ? (
            <div className="radio-group">
              {field.options.map((option, i) => (
                <label key={i} className="radio-option">
                  <input
                    type="radio"
                    name={field.label}
                    value={option}
                    required={field.required}
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <input
              className="form-input"
              type={field.type}
              placeholder={field.label}
              required={field.required}
            />
          )}
        </div>
      ))}
    </form>
  );
}
