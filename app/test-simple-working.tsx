export default function TestPage() {
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '50px', 
      fontSize: '24px',
      textAlign: 'center'
    }}>
      TEST PAGE - If you see this, Next.js is working!
      <br />
      Current time: {new Date().toLocaleString()}
    </div>
  )
}
