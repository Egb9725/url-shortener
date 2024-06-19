/*async function deleteUrl(shortUrl) {
    try {
      const response = await fetch(`/delete/${shortUrl}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.getElementById(`url-${shortUrl}`).remove();
      } else {
        console.error('erreur de la suppression');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }*/

  const deleteButton=document.getElementById('delete');
  deleteButton.addEventListener('click', async (event) => {
    try {
        const response = await fetch(`/delete/${shortUrl}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          document.getElementById(`url-${shortUrl}`).remove();
        } else {
          console.error('erreur de la suppression');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  });