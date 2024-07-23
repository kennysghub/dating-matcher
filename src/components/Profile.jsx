import { useState, useEffect } from "react";

const users = [
  {
    id: "1",
    name: "Alex",
    age: 28,
    bio: "Love hiking and photography",
    image:
      "https://www.pexels.com/photo/woman-in-brown-suede-peacoat-reading-a-book-762080/",
    preferences: {
      age: [25, 35],
      interests: ["hiking", "photography", "travel"],
      location: [40.7128, -74.006],
    },
    attributes: {
      interests: ["hiking", "photography", "cooking"],
      location: [40.7128, -74.006],
    },
  },
  {
    id: "2",
    name: "Sam",
    age: 32,
    bio: "Foodie and travel enthusiast",
    image:
      "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    preferences: {
      age: [28, 38],
      interests: ["food", "travel", "music"],
      location: [34.0522, -118.2437],
    },
    attributes: {
      interests: ["food", "travel", "yoga"],
      location: [34.0522, -118.2437],
    },
  },
  {
    id: "3",
    name: "Mariah",
    age: 26,
    bio: "Musician and coffee addict",
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    preferences: {
      age: [24, 30],
      interests: ["music", "coffee", "art"],
      location: [41.8781, -87.6298],
    },
    attributes: {
      interests: ["music", "coffee", "reading"],
      location: [41.8781, -87.6298],
    },
  },
  // ... (other users)
];

function calculateDistance(coord1, coord2) {
  const R = 6371; // Radius of the Earth in km
  const [lat1, lon1] = coord1.map((x) => (x * Math.PI) / 180); // Convert to radians
  const [lat2, lon2] = coord2.map((x) => (x * Math.PI) / 180);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

function calculateCompatibilityScore(user1, user2) {
  let score = 0;

  // Age compatibility
  if (
    user2.age >= user1.preferences.age[0] &&
    user2.age <= user1.preferences.age[1]
  ) {
    score += 25;
  }

  // Interest compatibility
  const commonInterests = user1.preferences.interests.filter((interest) =>
    user2.attributes.interests.includes(interest)
  );
  score += commonInterests.length * 5; // 5 points per common interest

  // Location compatibility
  const distance = calculateDistance(
    user1.preferences.location,
    user2.attributes.location
  );
  if (distance <= 10) score += 25; // Within 10 km
  else if (distance <= 50) score += 15; // Within 50 km
  else if (distance <= 100) score += 5; // Within 100 km

  return score;
}

function findMatches(users, targetUser, topN = 10) {
  const potentialMatches = users.filter((user) => user.id !== targetUser.id);

  const scoredMatches = potentialMatches.map((user) => ({
    user,
    score: calculateCompatibilityScore(targetUser, user),
  }));

  scoredMatches.sort((a, b) => b.score - a.score);

  return scoredMatches.slice(0, topN).map((match) => match.user);
}

const ProfileMatcher = () => {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const newMatches = findMatches(users, currentUser);
    setPotentialMatches(newMatches);
    setCurrentMatchIndex(0);
  }, [currentUser]);

  const handleLike = () => {
    setMatches([...matches, potentialMatches[currentMatchIndex]]);
    setCurrentMatchIndex((prev) => (prev + 1) % potentialMatches.length);
  };

  const handleDislike = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % potentialMatches.length);
  };

  const currentProfile = potentialMatches[currentMatchIndex];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "300px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <h2 style={{ textAlign: "center", padding: "1rem" }}>
          Find Your Match
        </h2>
        {currentProfile && (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <img
              src={currentProfile.image}
              alt={currentProfile.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            />
            <h3 style={{ margin: "0.5rem 0" }}>
              {currentProfile.name}, {currentProfile.age}
            </h3>
            <p style={{ color: "#666" }}>{currentProfile.bio}</p>
            <p style={{ fontSize: "0.9rem", color: "#888" }}>
              Interests: {currentProfile.attributes.interests.join(", ")}
            </p>
          </div>
        )}
        <div
          style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
        >
          <button
            onClick={handleDislike}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dislike
          </button>
          <button
            onClick={handleLike}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Like
          </button>
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center" }}>Your Matches ({matches.length})</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                width: "80px",
                textAlign: "center",
                backgroundColor: "white",
                padding: "0.5rem",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={match.image}
                alt={match.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  margin: "0 auto",
                }}
              />
              <p style={{ margin: "0.5rem 0", fontSize: "0.8rem" }}>
                {match.name}
              </p>
              <button
                style={{
                  fontSize: "0.7rem",
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileMatcher;
