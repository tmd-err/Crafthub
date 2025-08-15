const InfoRow = ({ icon, label, value }) => (
    <p className="flex items-center gap-2">
      <span className="text-indigo-500">{icon}</span>
      <span>
        <strong>{label}:</strong> {value}
      </span>
    </p>
  );
  
export default InfoRow ;