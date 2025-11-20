# ReviewRescue – Commit Versioning Instructions

Whenever changes are committed to this branch, update the version metadata located at:

https://review.bweb1.com.au/admin  
(Version fields on the Admin Settings page)

## Rules

1. **Increment version on every commit**
   - Format: `ReviewRescue v0.x.x`
   - Only increase the **patch** number unless explicitly told otherwise.

2. **Update Build Information**
   - Use the timestamp of the **latest file commit**.
   - Format EXACTLY:  
     `Build: YYYY-MM-DD HH:MM`  
     Example: `Build: 2025-11-20 16:34`

3. **Commit Message Requirement**
   - Every commit must include version + build, for example:  
     `ReviewRescue v0.2.0 — Build: 2025-11-20 16:34`

4. **Purpose**
   - The version/build values are used to confirm the branch was deployed correctly when pulled.  
   - When the admin page shows the updated date and time, the deployment is confirmed.

## Summary
On each commit:
- Increment patch version  
- Update build timestamp using the last file commit  
- Write both in the commit message  
- Ensure the admin page reflects the new version and build
