import React, { useState } from "react";

interface SecretInputProps {
  onSubmit: (
    secretName: string,
    secret: string,
    permissionedUserIdForRetrieveSecret: string | null,
    permissionedUserIdForUpdateSecret: string | null,
    permissionedUserIdForDeleteSecret: string | null,
    permissionedUserIdForComputeSecret: string | null,
  ) => void;
  secretName: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  secretType: "text" | "number"; // text for SecretBlob, number for SecretInteger
  otherPartyId: string | null;
}

const SecretInput: React.FC<SecretInputProps> = ({
  onSubmit,
  secretName,
  isDisabled = false,
  isLoading = false,
  secretType, // Destructure this prop
  otherPartyId,
}) => {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(isLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(
      secretName,
      secret,
      null,
      null,
      null,
      otherPartyId,
    );
    setSecret("");
  };

  return loading ? (
    <div>"Storing secret..."</div>
  ) : (
    <form onSubmit={handleSubmit} className={isDisabled ? "opacity-50" : ""}>
      <h1>Store secret: {secretName}</h1>
      <div>
        <label htmlFor="secret" className="block text-sm font-medium text-gray-700">
          Set secret value
        </label>
        <input
          type={secretType} // Use the prop here
          id="secret"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          required
          disabled={isDisabled}
          className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            isDisabled ? "cursor-not-allowed bg-gray-100" : "bg-white"
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isDisabled ? "opacity-75 cursor-not-allowed bg-indigo-400" : "bg-indigo-600"
        }`}
      >
        Submit
      </button>
    </form>
  );
};

export default SecretInput;
