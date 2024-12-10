### This PR implements infinite scroll pagination for the influencer feed to address performance issues with our current implementation.

### Context:

```
Current page load time: 3.2s (target: <1s)
Average daily active users: 25k
Mobile usage: 82% of traffic
Memory usage spikes: 1.2GB during peak hours
```

### Recent User Feedback:

```
"App becomes unresponsive when scrolling through many profiles"
"Takes forever to load on mobile data"
"Browser crashes after viewing ~100 profiles"
```

### Changes:

```
Implement virtual scrolling with TanStack Table
Add pagination endpoints in Rails API
Optimize image loading for mobile
Add scroll position restoration
```

### Performance Requirements:

```
Initial page load: <1s
Scroll framerate: 60fps
Max memory usage: 300MB
Support 1000+ records
```

#### Add your comment on the code to mark bugs and write your solutions explanation.
