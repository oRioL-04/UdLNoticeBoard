# 🎯 AI Chatbot - Update: Clickable Links & Multi-language Support

## 🎉 NEW FEATURES!

### 1. **Clickable Post Links**
When the AI mentions a post, it now includes a clickable link with the format `[ID:X]` that:
- Opens the post details directly
- Closes the chat modal automatically
- Takes you straight to the information you need

**Example:**
```
You: Is there any football event available?
AI: Tenemos la [ID:12] Torneo de Fútbol Universitario disponible...
```
Click on `[ID:12]` and the post opens! 🎯

### 2. **Multi-language Detection**
The chatbot now **automatically detects** your language and responds accordingly:
- 🇬🇧 **English** → Responds in English
- 🇪🇸 **Spanish** → Responde en Español
- 🇪🇸 **Catalan** → Respon en Català (limited support)

**No need to tell it which language to use - just ask naturally!**

---

## 🔥 How It Works

### **Language Detection:**
The system analyzes your question for language-specific keywords:

**Spanish indicators:**
- qué, cuál, cómo, dónde, cuándo, por qué
- hay, está, están, puedo, quiero, tengo
- este, esta, esto, algún, alguna

**Catalan indicators:**
- què, quin, quina, com, on, quan, per què
- hi ha, és, són, està, puc, vull, tinc
- aquest, aquesta, això

**English indicators:**
- what, which, how, where, when, why
- is, are, can, want, have, has
- this, that, some, any

### **Clickable Links:**
1. AI response includes post IDs in format `[ID:12]`
2. Frontend detects this pattern with regex
3. Converts it to a clickable element
4. On click: finds post by ID and opens details modal

---

## 🎨 UI Improvements

### **Link Styling:**
```css
.post-link {
  color: #8c0f57;        /* UdL burgundy */
  font-weight: 600;
  cursor: pointer;
  background: rgba(140, 15, 87, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.post-link:hover {
  background: rgba(140, 15, 87, 0.2);
  text-decoration: underline;
  transform: translateY(-1px);
}
```

### **Visual Feedback:**
- ✅ Hover effect on links
- ✅ Color matches UdL branding
- ✅ Smooth transitions
- ✅ Clear visual distinction

---

## 💬 Example Conversations

### **In English:**
**You:** What tutoring services are available?

**AI:** We have [ID:3] Tutoring Classes - Calculus I: 4th year student offers private classes. You will pass for sure! (Price: €15.0, Location: UdL Campus)

### **En Español:**
**Tú:** ¿Hay algún evento de fútbol disponible?

**IA:** Tenemos la [ID:12] Torneo de Fútbol Universitario disponible. Este torneo es una excelente oportunidad para participar y mostrar tu talento. ¡Esperamos ver a todos en el campo!

### **En Català:**
**Tu:** Quins serveis hi ha disponibles?

**IA:** Tenim [ID:3] Classes de Càlcul I disponibles. El preu és de €15.0 al Campus UdL.

*(Note: Catalan responses may be less accurate due to model limitations)*

---

## 🔧 Technical Implementation

### **Backend Changes:**

#### **1. Language Detection Function:**
```python
def detectar_idioma(texto):
    """Detects language: spanish, catalan, or english"""
    # Counts language-specific keywords
    # Returns most probable language
```

#### **2. Enhanced Chat Response:**
```python
@app.route('/api/chat', methods=['POST'])
def chat():
    # Detect language
    idioma = detectar_idioma(pregunta)
    
    # Generate response with language context
    respuesta, posts_mencionados = generar_respuesta_chat(
        pregunta, anuncios, idioma
    )
    
    # Return response with post IDs
    return jsonify({
        'respuesta': respuesta,
        'posts': posts_mencionados,
        'idioma': idioma
    })
```

#### **3. Language-Specific Prompts:**
```python
instrucciones_idioma = {
    'spanish': """Responde en ESPAÑOL. 
IMPORTANTE: Cuando menciones un post, SIEMPRE incluye su ID así: [ID:12]
Ejemplo: "Tenemos el [ID:12] Torneo de Fútbol..."
""",
    'catalan': """Respon en CATALÀ.
IMPORTANT: Quan mencionas un post, SEMPRE inclou ID així: [ID:12]
""",
    'english': """Answer in ENGLISH.
IMPORTANT: ALWAYS include post ID like: [ID:12]
"""
}
```

#### **4. ID Extraction:**
```python
import re
# Extract [ID:X] patterns from response
ids_encontrados = re.findall(r'\[ID:(\d+)\]', respuesta)
posts_mencionados = [int(id) for id in ids_encontrados]
```

### **Frontend Changes:**

#### **1. Link Rendering Function:**
```javascript
const renderMensajeConLinks = (mensaje) => {
  const regex = /\[ID:(\d+)\]/g;
  const partes = [];
  let match;
  
  // Find all [ID:X] patterns
  while ((match = regex.exec(mensaje.texto)) !== null) {
    partes.push({ tipo: 'link', id: parseInt(match[1]) });
  }
  
  return partes;
};
```

#### **2. Click Handler:**
```javascript
const handleClickPost = (postId) => {
  const post = anuncios.find(a => a.id === postId);
  if (post) {
    setAnuncioSeleccionado(post);
    setMostrarChat(false); // Close chat
  }
};
```

#### **3. Enhanced Message Rendering:**
```jsx
{mensajesChat.map((mensaje, index) => (
  <div className="mensaje-texto">
    {renderMensajeConLinks(mensaje).map((parte, idx) => (
      parte.tipo === 'link' ? (
        <span 
          className="post-link"
          onClick={() => handleClickPost(parte.id)}
        >
          {parte.contenido}
        </span>
      ) : (
        <span>{parte.contenido}</span>
      )
    ))}
  </div>
))}
```

---

## 📊 Language Support Status

| Language | Detection | AI Response | Link Support | Status |
|----------|-----------|-------------|--------------|--------|
| English | ✅ Excellent | ✅ Excellent | ✅ Yes | 🟢 Full |
| Spanish | ✅ Excellent | ✅ Excellent | ✅ Yes | 🟢 Full |
| Catalan | ✅ Good | ⚠️ Limited | ✅ Yes | 🟡 Partial |

**Note:** Catalan has limited support because llama3.2:1b (1.3GB) is a small model primarily trained on English and major Romance languages. For better Catalan support, consider:
- Using a larger model (llama3.2:3b or llama3:7b)
- Upgrading to a multilingual model
- Using fallback keyword system for Catalan

---

## 🎯 Testing the Features

### **Test Clickable Links:**

1. Open app at http://localhost:3000
2. Click "💬 AI Assistant"
3. Ask: "What events are available?"
4. Look for `[ID:X]` in the response
5. Click on any `[ID:X]`
6. ✅ Post details should open!

### **Test Multi-language:**

**English:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"What tutoring services are available?"}'
```

**Spanish:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"¿Qué eventos hay disponibles?"}'
```

**Catalan:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"Quins serveis hi ha?"}'
```

---

## 🚀 Try These Questions!

### **English:**
- "Is there any football event available?"
- "Show me tutoring services"
- "What rooms are for rent?"
- "Any free posts?"

### **Español:**
- "¿Hay algún evento de fútbol disponible?"
- "Muéstrame servicios de tutoría"
- "¿Qué habitaciones hay en alquiler?"
- "¿Hay algo gratis?"

### **Català:**
- "Hi ha algun esdeveniment de futbol?"
- "Mostra'm serveis de tutoria"
- "Quines habitacions hi ha de lloguer?"
- "Hi ha res gratuït?"

---

## 💡 Pro Tips

### **Best Practices:**

1. **Be Natural**: Just ask in your language, no need to specify
2. **Click IDs**: Use clickable links to quickly view posts
3. **Follow-ups**: Ask related questions to explore more
4. **Mix Languages**: Can switch languages mid-conversation!

### **Power User Tricks:**

1. **Quick Navigation:**
   - Ask question → Click [ID:X] → See details
   - No need to search manually!

2. **Comparison:**
   - Ask: "Compare tutoring services"
   - Click multiple [ID:X] links to compare

3. **Discovery:**
   - Ask broad questions
   - Get multiple [ID:X] links
   - Explore each one

---

## 🎓 What's New Summary

✅ **Clickable Links**: Post IDs are now clickable, opening post details instantly
✅ **Multi-language**: Automatic language detection (English, Spanish, Catalan)
✅ **Smart Navigation**: Chat → Click → Details modal (chat auto-closes)
✅ **Better UX**: Visual feedback on hover, smooth transitions
✅ **Seamless**: No configuration needed, just ask naturally!

---

**Ready to try it? Ask something in your language! 🌍🚀**

http://localhost:3000 → Click "💬 AI Assistant" → Ask away!
