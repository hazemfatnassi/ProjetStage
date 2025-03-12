document.addEventListener('DOMContentLoaded', async function() {
    const profileButton = document.getElementById('profileButton');
    const profileInitial = document.getElementById('profileInitial');
    const authButtons = document.getElementById('authButtons');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const editButton = document.getElementById('editButton');
    const editForm = document.getElementById('editForm');
    const errorMessage = document.getElementById('errorMessage');
    const toggleHistoryButton = document.getElementById('toggleHistoryButton');
    const planHistory = document.getElementById('planHistory');
    const planHistoryList = document.getElementById('planHistoryList');
    const connected = localStorage.getItem('connected') === 'true';
  
    if (connected) {
      const currentUserId = localStorage.getItem('current_user_id');
  
      try {
        const response = await fetch(`http://localhost:3000/user/${currentUserId}`);
        if (response.ok) {
          const user = await response.json();
  
          document.getElementById('profileUsername').textContent = user.username;
          document.getElementById('profileName').textContent = user.name;
          document.getElementById('profileTelephone').textContent = user.telephone;
          document.getElementById('profileEmail').textContent = user.email;
          document.getElementById('profileAdress').textContent = user.adress;
          document.getElementById('profileAge').textContent = user.age;
  
          const currentDate = new Date();
          const sortedPlanHistory = user.planHistory.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
          const activePlan = sortedPlanHistory.find(plan => new Date(plan.endDate) > currentDate);
  
          if (activePlan) {
            document.getElementById('profilePlan').textContent = activePlan.plan;
            document.getElementById('profilePlanEndDate').textContent = activePlan.endDate;
          } else {
            document.getElementById('profilePlan').textContent = 'Aucun';
            document.getElementById('profilePlanEndDate').textContent = 'N/A';
          }
  
          profileInitial.textContent = user.username.charAt(0).toUpperCase();
  
          document.getElementById('editUsername').value = user.username;
          document.getElementById('editName').value = user.name;
          document.getElementById('editTelephone').value = user.telephone;
          document.getElementById('editEmail').value = user.email;
          document.getElementById('editAdress').value = user.adress;
          document.getElementById('editAge').value = user.age;
  
          sortedPlanHistory.forEach(plan => {
            const listItem = document.createElement('li');
            listItem.textContent = `${plan.plan} (du ${plan.startDate} au ${plan.endDate})`;
            planHistoryList.appendChild(listItem);
          });
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
  
      profileButton.style.display = 'flex';
      authButtons.style.display = 'none';
    } else {
      profileButton.style.display = 'none';
      authButtons.style.display = 'flex';
    }
  
    profileButton.addEventListener('click', function() {
      profileMenu.style.display = profileMenu.style.display === 'none' ? 'flex' : 'none';
    });
  
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('current_user_id');
      localStorage.setItem('connected', 'false');
      window.location.href = '/';
    });
  
    editButton.addEventListener('click', function() {
      editForm.style.display = editForm.style.display === 'none' ? 'flex' : 'none';
    });
  
    editForm.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const currentUserId = localStorage.getItem('current_user_id');
      const currentPassword = document.getElementById('editPassword').value;
  
      try {
        const response = await fetch(`http://localhost:3000/user/${currentUserId}`);
        if (response.ok) {
          const user = await response.json();
  
          if (user.password !== currentPassword) {
            errorMessage.textContent = 'Mot de passe incorrect.';
            errorMessage.style.display = 'block';
            return;
          }
  
          const updatedUser = {
            username: document.getElementById('editUsername').value,
            name: document.getElementById('editName').value,
            telephone: document.getElementById('editTelephone').value,
            email: document.getElementById('editEmail').value,
            adress: document.getElementById('editAdress').value,
            age: document.getElementById('editAge').value,
          };
  
          const updateResponse = await fetch(`http://localhost:3000/user/${currentUserId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
          });
  
          if (updateResponse.ok) {
            document.getElementById('profileUsername').textContent = updatedUser.username;
            document.getElementById('profileName').textContent = updatedUser.name;
            document.getElementById('profileTelephone').textContent = updatedUser.telephone;
            document.getElementById('profileEmail').textContent = updatedUser.email;
            document.getElementById('profileAdress').textContent = updatedUser.adress;
            document.getElementById('profileAge').textContent = updatedUser.age;
            profileInitial.textContent = updatedUser.username.charAt(0).toUpperCase();
  
            editForm.style.display = 'none';
          } else {
            errorMessage.textContent = 'Erreur lors de la mise à jour du profil.';
            errorMessage.style.display = 'block';
          }
        } else {
          errorMessage.textContent = 'Erreur lors de la récupération des données utilisateur.';
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        errorMessage.textContent = 'Erreur de connexion au serveur.';
        errorMessage.style.display = 'block';
      }
    });
  
    toggleHistoryButton.addEventListener('click', function() {
      planHistory.style.display = planHistory.style.display === 'none' ? 'block' : 'none';
    });
  });